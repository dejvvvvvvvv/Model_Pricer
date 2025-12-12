const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class PrusaSlicerWrapper {
  constructor() {
    // Lokální PrusaSlicer (Flatpak) with virtual display for headless mode
    this.prusaSlicerCmd = 'xvfb-run -a flatpak run com.prusa3d.PrusaSlicer';
    
    // Lokální cesty (žádné SSH)
    this.basePath = '/home/dejvvvvvvvv/prusaslicer';
    this.modelsPath = `${this.basePath}/models`;
    this.profilesPath = `${this.basePath}/profiles`;
    this.outputPath = `${this.basePath}/output`;
    
    // Local temp directory
    this.tempDir = '/tmp/prusaslicer-temp';
  }

  async initialize() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
      console.log('[PrusaSlicer] Initialized, temp dir:', this.tempDir);
      console.log('[PrusaSlicer] Using local PrusaSlicer (no SSH)');
    } catch (error) {
      console.error('[PrusaSlicer] Init error:', error);
      throw error;
    }
  }

  /**
   * Slice STL file locally and return metadata
   */
  async slice(stlBuffer, config) {
    const tempId = Date.now();
    const modelName = `model_${tempId}.stl`;
    const gcodeName = `output_${tempId}.gcode`;
    
    const stlPath = `${this.modelsPath}/${modelName}`;
    const gcodePath = `${this.outputPath}/${gcodeName}`;

    try {
      // 1. Write STL directly to models folder
      await fs.writeFile(stlPath, stlBuffer);
      console.log('[PrusaSlicer] STL saved:', stlPath);

      // 2. Build slicing command
      const slicingCommand = this.buildSlicingCommand(stlPath, gcodePath, config);
      console.log('[PrusaSlicer] Executing:', slicingCommand);

      // 3. Execute slicing locally
      await this.executeCommand(slicingCommand);
      console.log('[PrusaSlicer] Slicing completed');

      // 4. Read G-code
      const gcode = await fs.readFile(gcodePath, 'utf8');
      const metadata = this.parseGCode(gcode);

      // 5. Cleanup
      await this.cleanup([stlPath, gcodePath]);

      return {
        time: metadata.printTime,
        material: metadata.filamentUsed,
        layers: metadata.layerCount,
        success: true
      };

    } catch (error) {
      console.error('[PrusaSlicer] Slicing error:', error);
      await this.cleanup([stlPath, gcodePath]);
      throw error;
    }
  }

  /**
   * Build slicing command for local execution
   */
  buildSlicingCommand(inputPath, outputPath, config) {
    const parts = [
      this.prusaSlicerCmd,
      '--export-gcode',
      `--load ${this.profilesPath}/test_config.ini`
    ];

    // Add scale if specified
    if (config.scale) {
      parts.push(`--scale ${config.scale}`);
    }

    // Add dynamic parameter overrides
    const overrides = this.buildParameterOverrides(config);
    parts.push(...overrides);

    // Add input and output
    parts.push(inputPath);
    parts.push(`-o ${outputPath}`);

    return parts.join(' ');
  }

  /**
   * Build parameter overrides from config
   */
  buildParameterOverrides(config) {
    const overrides = [];

    // Layer height override
    if (config.layerHeight !== undefined) {
      overrides.push(`-s layer_height=${config.layerHeight}`);
    }

    // Infill override
    if (config.infill !== undefined) {
      overrides.push(`-s fill_density=${config.infill}%`);
    }

    // Walls (perimeters) override
    if (config.walls !== undefined) {
      overrides.push(`-s perimeters=${config.walls}`);
    }

    // Supports override
    if (config.supports !== undefined) {
      overrides.push(`-s support_material=${config.supports ? 1 : 0}`);
    }

    // Speed override
    if (config.speed !== undefined) {
      overrides.push(`-s speed_print=${config.speed}`);
      overrides.push(`-s speed_travel=${config.speed * 2}`); // Travel speed = 2x print speed
    }

    // Nozzle diameter override
    if (config.nozzleDiameter !== undefined) {
      overrides.push(`-s nozzle_diameter=${config.nozzleDiameter}`);
    }

    // Brim override
    if (config.brim !== undefined && config.brim) {
      overrides.push(`-s brim_width=5`); // 5mm brim
    }

    // Raft override
    if (config.raft !== undefined && config.raft) {
      overrides.push(`-s raft_layers=3`);
    }

    console.log('[PrusaSlicer] Parameter overrides:', overrides);

    return overrides;
  }

  /**
   * Execute shell command
   */
  executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
          console.error('[PrusaSlicer] Command error:', stderr);
          reject(new Error(stderr || error.message));
          return;
        }
        resolve(stdout);
      });
    });
  }

  /**
   * Parse G-code to extract metadata
   */
  parseGCode(gcode) {
    const lines = gcode.split('\n');
    let printTime = 0; // seconds
    let filamentUsed = 0; // grams
    let layerCount = 0;
    let filamentLength = 0; // mm

    for (const line of lines) {
      // PrusaSlicer metadata format:
      // ; estimated printing time (normal mode) = 1h 23m 45s
      if (line.includes('; estimated printing time')) {
        const timeMatch = line.match(/(\d+)h\s*(\d+)m\s*(\d+)s/);
        if (timeMatch) {
          const hours = parseInt(timeMatch[1]) || 0;
          const minutes = parseInt(timeMatch[2]) || 0;
          const seconds = parseInt(timeMatch[3]) || 0;
          printTime = hours * 3600 + minutes * 60 + seconds;
        } else {
          // Try minutes only: 23m 45s
          const minMatch = line.match(/(\d+)m\s*(\d+)s/);
          if (minMatch) {
            const minutes = parseInt(minMatch[1]) || 0;
            const seconds = parseInt(minMatch[2]) || 0;
            printTime = minutes * 60 + seconds;
          }
        }
      }

      // ; filament used [mm] = 1234.56
      if (line.includes('; filament used [mm]')) {
        const match = line.match(/=\s*([\d.]+)/);
        if (match) {
          filamentLength = parseFloat(match[1]);
        }
      }

      // ; filament used [g] = 12.34
      if (line.includes('; filament used [g]')) {
        const match = line.match(/=\s*([\d.]+)/);
        if (match) {
          filamentUsed = parseFloat(match[1]);
        }
      }

      // Count layers
      if (line.startsWith(';LAYER:') || line.startsWith('; layer ')) {
        layerCount++;
      }
    }

    // If filament weight not found, calculate from length
    if (filamentUsed === 0 && filamentLength > 0) {
      // Calculate volume: length * π * (diameter/2)²
      const diameter = 1.75; // mm
      const volumeMm3 = filamentLength * Math.PI * Math.pow(diameter / 2, 2);
      const volumeCm3 = volumeMm3 / 1000;
      // PLA density = 1.24 g/cm³
      filamentUsed = volumeCm3 * 1.24;
    }

    console.log('[PrusaSlicer] Parsed metadata:', {
      printTime,
      filamentUsed,
      layerCount
    });

    return {
      printTime: printTime,
      filamentUsed: Math.round(filamentUsed * 100) / 100,
      layerCount: layerCount
    };
  }

  /**
   * Cleanup temp files
   */
  async cleanup(files) {
    for (const file of files) {
      try {
        await fs.unlink(file);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }
}

// Singleton instance
const prusaSlicer = new PrusaSlicerWrapper();
module.exports = prusaSlicer;
