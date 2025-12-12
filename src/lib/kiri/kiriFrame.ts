// IFrame-based Kiri:Moto integration
// Uses the official Frame Message API: https://grid.space/kiri/frame.html

export type KiriFrameConfig = {
    mode?: 'FDM' | 'SLA' | 'CAM' | 'LASER';
    device?: any;
    process?: any;
};

export type SlicingResult = {
    time: number; // seconds
    material: number; // grams  
    layers: number;
    gcode?: string;
};

export class KiriFrame {
    private iframe: HTMLIFrameElement | null = null;
    private ready: boolean = false;
    private messageHandlers: Map<string, (data: any) => void> = new Map();
    private pendingRequests: Map<number, { resolve: Function; reject: Function }> = new Map();
    private requestId: number = 0;

    constructor(private container: HTMLElement) { }

    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Create hidden iframe
            this.iframe = document.createElement('iframe');
            this.iframe.src = 'https://grid.space/kiri/';
            this.iframe.style.display = 'none';
            this.iframe.style.position = 'absolute';
            this.iframe.style.width = '1px';
            this.iframe.style.height = '1px';
            this.iframe.style.opacity = '0';
            this.iframe.style.pointerEvents = 'none';

            // Listen for messages from iframe
            window.addEventListener('message', this.handleMessage.bind(this));

            // Wait for iframe to load
            this.iframe.onload = () => {
                console.log('[KiriFrame] IFrame loaded');
                // Give it a moment to initialize
                setTimeout(() => {
                    this.ready = true;
                    resolve();
                }, 1000);
            };

            this.iframe.onerror = () => {
                reject(new Error('Failed to load Kiri:Moto iframe'));
            };

            this.container.appendChild(this.iframe);
        });
    }

    private handleMessage(event: MessageEvent) {
        if (event.origin !== 'https://grid.space') return;

        const { type, data, id } = event.data;
        console.log('[KiriFrame] Message received:', { type, data, id });

        // Handle responses to our requests
        if (id !== undefined && this.pendingRequests.has(id)) {
            const { resolve } = this.pendingRequests.get(id)!;
            this.pendingRequests.delete(id);
            resolve(data);
            return;
        }

        // Handle event notifications
        const handler = this.messageHandlers.get(type);
        if (handler) {
            handler(data);
        }
    }

    private sendMessage(type: string, data?: any): Promise<any> {
        if (!this.iframe || !this.ready) {
            return Promise.reject(new Error('Kiri:Moto iframe not ready'));
        }

        const id = this.requestId++;

        return new Promise((resolve, reject) => {
            this.pendingRequests.set(id, { resolve, reject });

            this.iframe!.contentWindow!.postMessage(
                { type, data, id },
                'https://grid.space'
            );

            // Timeout after 30 seconds
            setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    reject(new Error(`Request timeout: ${type}`));
                }
            }, 30000);
        });
    }

    on(event: string, handler: (data: any) => void) {
        this.messageHandlers.set(event, handler);
    }

    async loadModel(fileData: ArrayBuffer, filename: string): Promise<void> {
        await this.sendMessage('load', {
            file: Array.from(new Uint8Array(fileData)),
            filename
        });
    }

    async setMode(mode: 'FDM' | 'SLA' | 'CAM' | 'LASER'): Promise<void> {
        await this.sendMessage('mode', mode);
    }

    async setDevice(device: any): Promise<void> {
        await this.sendMessage('device', device);
    }

    async setProcess(process: any): Promise<void> {
        await this.sendMessage('process', process);
    }

    async slice(): Promise<SlicingResult> {
        const result = await this.sendMessage('slice');

        // Extract statistics from result
        // Note: The exact format depends on Kiri:Moto's response
        return {
            time: result.time || 0,
            material: result.weight || 0,
            layers: result.layers || 0,
            gcode: result.gcode
        };
    }

    destroy() {
        if (this.iframe && this.iframe.parentNode) {
            this.iframe.parentNode.removeChild(this.iframe);
        }
        window.removeEventListener('message', this.handleMessage.bind(this));
        this.iframe = null;
        this.ready = false;
    }
}
