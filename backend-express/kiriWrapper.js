// Wrapper for KiriMotoSlicer CLI
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

const KIRI_SLICER_PATH = path.join(__dirname, 'kiri-slicer', 'kirimoto-slicer');

/**
 * Slice STL file using KiriMotoSlicer
 * @param {Buffer} stlBuffer - STL file buffer
 * @param {Object} config - Slicing configuration
 * @returns {Promise<Object>} - Slicing results
 */
async function sliceWithKiri(stlBuffer, config) {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'kiri-'));
    const stlPath = path.join(tempDir, 'model.stl');
    const gcodeOutput = path.join(tempDir, 'output.gcode');

    try {
        // Write STL to temp file
        await fs.writeFile(stlPath, stlBuffer);

        // Map config to KiriMoto CLI parameters
        const params = buildKiriParams(config, gcodeOutput);

        // Execute KiriMotoSlicer
        const command = `node "${KIRI_SLICER_PATH}" ${params.join(' ')} "${stlPath}"`;
        console.log('[KiriWrapper] Executing:', command);

        const { stdout, stderr } = await execPromise(command);

        if (stderr && !stderr.includes('Slicing complete')) {
            console.warn('[KiriWrapper] Stderr:', stderr);
        }

        // Parse G-code to extract statistics
        const gcode = await fs.readFile(gcodeOutput, 'utf8');
        const stats = parseGcodeStats(gcode);

        return {
            time: stats.time,
            material: stats.material,
            layers: stats.layers,
            gcode: gcode,
            success: true,
        };

    } finally {
        // Cleanup temp files
        try {
            await fs.rm(tempDir, { recursive: true, force: true });
        } catch (err) {
            console.warn('[KiriWrapper] Cleanup failed:', err);
        }
    }
}

/**
 * Build KiriMotoSlicer CLI parameters from config
 */
function buildKiriParams(config, outputPath) {
    const {
        quality = 'standard',
        infill = 20,
        material = 'pla',
        supports = false,
    } = config;

    // Map quality to layer height
    const layerHeightMap = {
        nozzle_08: 0.4,
        nozzle_06: 0.3,
        nozzle_04: 0.2,
        draft: 0.3,
        standard: 0.2,
        fine: 0.15,
        ultra: 0.1,
    };

    // Map quality to nozzle size
    const nozzleSizeMap = {
        nozzle_08: 0.8,
        nozzle_06: 0.6,
        nozzle_04: 0.4,
        draft: 0.4,
        standard: 0.4,
        fine: 0.4,
        ultra: 0.4,
    };

    // Material temperatures
    const tempMap = {
        pla: { nozzle: 200, bed: 60 },
        abs: { nozzle: 250, bed: 100 },
        petg: { nozzle: 230, bed: 80 },
        tpu: { nozzle: 220, bed: 60 },
        wood: { nozzle: 210, bed: 60 },
        carbon: { nozzle: 240, bed: 80 },
    };

    const layerHeight = layerHeightMap[quality] || 0.2;
    const nozzleSize = nozzleSizeMap[quality] || 0.4;
    const temps = tempMap[material] || tempMap.pla;

    const params = [
        `-o "${outputPath}"`,
        `--sliceHeight=${layerHeight}`,
        `--sliceFillSparse=${infill / 100}`,
        `--sliceFillType=gyroid`,
        `--sliceShells=3`,
        `--sliceTopLayers=3`,
        `--sliceBottomLayers=3`,
        `--sliceSupportEnable=${supports}`,
        `--sliceSupportDensity=0.25`,
        `--outputTemp=${temps.nozzle}`,
        `--outputBedTemp=${temps.bed}`,
        `--outputFeedrate=50`,
        `--outputSeekrate=80`,
        `--extruders.0.extNozzle=${nozzleSize}`,
        `--extruders.0.extFilament=1.75`,
        // Bambu Lab A1 bed size
        `--bedWidth=256`,
        `--bedDepth=256`,
        `--maxHeight=256`,
        `--deviceName="Bambu Lab A1"`,
    ];

    return params;
}

/**
 * Parse G-code to extract statistics
 */
function parseGcodeStats(gcode) {
    const lines = gcode.split('\n');

    let totalTime = 0;
    let totalFilament = 0;
    let layerCount = 0;
    let currentE = 0;
    let lastE = 0;

    for (const line of lines) {
        // Count layers
        if (line.includes(';LAYER:')) {
            layerCount++;
        }

        // Track filament usage (E values)
        const eMatch = line.match(/E([\d.]+)/);
        if (eMatch) {
            currentE = parseFloat(eMatch[1]);
            if (currentE > lastE) {
                totalFilament += (currentE - lastE);
            }
            lastE = currentE;
        }

        // Estimate time from feedrate and distance
        const gMatch = line.match(/G[01]\s/);
        const fMatch = line.match(/F([\d.]+)/);
        if (gMatch && fMatch) {
            // Simplified time calculation
            // In real implementation, would calculate distance and divide by feedrate
        }
    }

    // Calculate material weight from filament length
    const filamentDiameter = 1.75; // mm
    const radius = filamentDiameter / 2;
    const volumeMm3 = Math.PI * radius * radius * totalFilament;
    const volumeCm3 = volumeMm3 / 1000;
    const density = 1.24; // PLA density, should be material-specific
    const materialGrams = volumeCm3 * density;

    // Estimate time (rough calculation)
    // Average 45 seconds per layer for Bambu Lab A1
    const estimatedTime = layerCount * 45;

    return {
        time: estimatedTime,
        material: materialGrams,
        layers: layerCount,
    };
}

/**
 * Promisify exec
 */
function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

module.exports = { sliceWithKiri };
