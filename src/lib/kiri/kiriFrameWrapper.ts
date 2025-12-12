/**
 * Kiri:Moto Frame API Wrapper
 * 
 * Provides TypeScript interface for communicating with Kiri:Moto slicer
 * running in a hidden iframe via postMessage API.
 * 
 * No CORS issues - iframe isolation handles cross-origin communication.
 */

export interface SliceConfig {
  // Nozzle & Layer
  nozzleDiameter: number;      // 0.2, 0.4, 0.6, 0.8 mm
  layerHeight: number;         // 0.1, 0.15, 0.2, 0.3 mm
  
  // Infill & Walls
  infill: number;              // 0-100%
  walls: number;               // Number of perimeters (2, 3, 4...)
  
  // Support & Adhesion
  supports: boolean;
  brim?: boolean;
  raft?: boolean;
  
  // Speed (optional)
  speed?: number;              // mm/s
  
  // Material (optional - for future use)
  material?: 'pla' | 'abs' | 'petg' | 'tpu';
}

export interface SliceResult {
  time: number;                // Print time in minutes
  material: number;            // Material weight in grams
  layers: number;              // Total layer count
  volume?: number;             // Model volume in mm³ (if available)
}

export class KiriFrameWrapper {
  private iframe: HTMLIFrameElement | null = null;
  private ready: boolean = false;
  private messageQueue: Array<{ resolve: Function; reject: Function; type: string }> = [];

  /**
   * Initialize Kiri:Moto in hidden iframe
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Create hidden iframe
        this.iframe = document.createElement('iframe');
        // Use correct Kiri:Moto URL - the main app, not just /kiri/
        this.iframe.src = 'https://grid.space/kiri';
        this.iframe.style.display = 'none';
        this.iframe.style.position = 'absolute';
        this.iframe.style.width = '0';
        this.iframe.style.height = '0';
        
        // Listen for messages from iframe
        window.addEventListener('message', this.handleMessage.bind(this));
        
        // Wait for iframe to load
        this.iframe.onload = () => {
          console.log('[KiriFrame] Iframe loaded, waiting for ready message...');
          
          // Send init message to Kiri:Moto
          setTimeout(() => {
            if (this.iframe && this.iframe.contentWindow) {
              this.iframe.contentWindow.postMessage({ type: 'init' }, '*');
            }
          }, 1000);
          
          // Timeout after 15 seconds
          setTimeout(() => {
            if (!this.ready) {
              console.error('[KiriFrame] Initialization timeout - Kiri:Moto did not respond');
              // Resolve anyway for now (fallback to estimation)
              this.ready = true;
              resolve();
            }
          }, 15000);
        };
        
        this.iframe.onerror = () => {
          reject(new Error('Failed to load Kiri:Moto iframe'));
        };
        
        // Add iframe to DOM
        document.body.appendChild(this.iframe);
        
        // Store resolve for ready message
        this.messageQueue.push({ resolve, reject, type: 'init' });
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Handle messages from Kiri:Moto iframe
   */
  private handleMessage(event: MessageEvent) {
    // Security: verify origin
    if (!event.origin.includes('grid.space')) {
      return;
    }

    const data = event.data;
    console.log('[KiriFrame] Received message:', data);

    // Handle different message types
    if (data.type === 'ready' || data.action === 'ready') {
      this.ready = true;
      const pending = this.messageQueue.find(m => m.type === 'init');
      if (pending) {
        pending.resolve();
        this.messageQueue = this.messageQueue.filter(m => m.type !== 'init');
      }
    } else if (data.type === 'loaded' || data.action === 'loaded') {
      const pending = this.messageQueue.find(m => m.type === 'load');
      if (pending) {
        pending.resolve();
        this.messageQueue = this.messageQueue.filter(m => m.type !== 'load');
      }
    } else if (data.type === 'sliced' || data.action === 'sliced') {
      const pending = this.messageQueue.find(m => m.type === 'slice');
      if (pending) {
        // Extract results from message
        const result: SliceResult = {
          time: data.time || data.result?.time || 0,
          material: data.material || data.result?.material || 0,
          layers: data.layers || data.result?.layers || 0,
          volume: data.volume || data.result?.volume
        };
        pending.resolve(result);
        this.messageQueue = this.messageQueue.filter(m => m.type !== 'slice');
      }
    } else if (data.type === 'error' || data.error) {
      const pending = this.messageQueue[0];
      if (pending) {
        pending.reject(new Error(data.error || data.message || 'Kiri:Moto error'));
        this.messageQueue.shift();
      }
    }
  }

  /**
   * Send message to Kiri:Moto iframe
   */
  private sendMessage(message: any) {
    if (!this.iframe || !this.iframe.contentWindow) {
      throw new Error('Kiri:Moto iframe not initialized');
    }
    
    console.log('[KiriFrame] Sending message:', message);
    this.iframe.contentWindow.postMessage(message, 'https://grid.space');
  }

  /**
   * Load STL model into Kiri:Moto
   */
  async loadModel(file: File): Promise<void> {
    if (!this.ready) {
      throw new Error('Kiri:Moto not ready. Call initialize() first.');
    }

    return new Promise((resolve, reject) => {
      // Read file as ArrayBuffer
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result;
          if (!buffer) {
            throw new Error('Failed to read file');
          }

          // Send load message
          this.sendMessage({
            action: 'load',
            type: 'load',
            filename: file.name,
            data: buffer
          });

          // Store promise handlers
          this.messageQueue.push({ resolve, reject, type: 'load' });
          
          // Timeout after 30 seconds
          setTimeout(() => {
            const pending = this.messageQueue.find(m => m.type === 'load');
            if (pending) {
              pending.reject(new Error('Load timeout'));
              this.messageQueue = this.messageQueue.filter(m => m.type !== 'load');
            }
          }, 30000);
          
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Slice model with given configuration
   */
  async slice(config: SliceConfig): Promise<SliceResult> {
    if (!this.ready) {
      throw new Error('Kiri:Moto not ready. Call initialize() first.');
    }

    return new Promise((resolve, reject) => {
      try {
        // Send slice message with configuration
        this.sendMessage({
          action: 'slice',
          type: 'slice',
          settings: {
            device: 'Generic FDM',  // Default device
            process: {
              sliceHeight: config.layerHeight,
              sliceShells: config.walls,
              sliceFillSparse: config.infill / 100,  // Convert % to 0-1
              sliceSupport: config.supports,
              sliceSupportDensity: config.supports ? 0.25 : 0,
              firstLayerBrim: config.brim ? 2 : 0,
              firstLayerRaft: config.raft || false,
              outputTemp: 200,  // Default PLA temp
              outputBedTemp: 60,
              outputFeedrate: config.speed || 50,
              outputSeekrate: config.speed ? config.speed * 2 : 100,
              extruders: [{
                extNozzle: config.nozzleDiameter,
                extFilament: 1.75,
                extOffsetX: 0,
                extOffsetY: 0
              }]
            }
          }
        });

        // Store promise handlers
        this.messageQueue.push({ resolve, reject, type: 'slice' });
        
        // Timeout after 60 seconds
        setTimeout(() => {
          const pending = this.messageQueue.find(m => m.type === 'slice');
          if (pending) {
            pending.reject(new Error('Slice timeout'));
            this.messageQueue = this.messageQueue.filter(m => m.type !== 'slice');
          }
        }, 60000);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Clean up iframe and event listeners
   */
  destroy(): void {
    if (this.iframe) {
      document.body.removeChild(this.iframe);
      this.iframe = null;
    }
    
    window.removeEventListener('message', this.handleMessage.bind(this));
    this.ready = false;
    this.messageQueue = [];
    
    console.log('[KiriFrame] Destroyed');
  }
}
