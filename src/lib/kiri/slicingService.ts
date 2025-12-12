// Slicing service for processing 3D models with Kiri:Moto engine
export type SlicingConfig = {
    quality: 'nozzle_08' | 'nozzle_06' | 'nozzle_04' | 'draft' | 'standard' | 'fine' | 'ultra';
    infill: number; // 10-100
    material: 'pla' | 'abs' | 'petg' | 'tpu' | 'wood' | 'carbon';
    supports: boolean;
    quantity: number;
};

export type SlicingResult = {
    time: number; // seconds
    material: number; // grams
    layers: number;
    gcode?: string;
};

// Map quality settings to layer height
const qualityToLayerHeight: Record<string, number> = {
    nozzle_08: 0.4,
    nozzle_06: 0.3,
    nozzle_04: 0.2,
    draft: 0.3,
    standard: 0.2,
    fine: 0.15,
    ultra: 0.1,
};

// Map quality to nozzle size
const qualityToNozzle: Record<string, number> = {
    nozzle_08: 0.8,
    nozzle_06: 0.6,
    nozzle_04: 0.4,
    draft: 0.4,
    standard: 0.4,
    fine: 0.4,
    ultra: 0.4,
};

export async function sliceModel(
    engine: any,
    file: File,
    config: SlicingConfig
): Promise<SlicingResult> {
    if (!engine) {
        throw new Error('Engine not initialized');
    }

    console.log('[slicingService] Starting slice with config:', config);

    return new Promise(async (resolve, reject) => {
        try {
            // Read file as ArrayBuffer
            const buffer = await file.arrayBuffer();

            // Determine file type
            const fileType = file.name.toLowerCase().endsWith('.stl') ? 'stl' :
                file.name.toLowerCase().endsWith('.obj') ? 'obj' :
                    file.name.toLowerCase().endsWith('.3mf') ? '3mf' : 'stl';

            const layerHeight = qualityToLayerHeight[config.quality] || 0.2;
            const nozzleSize = qualityToNozzle[config.quality] || 0.4;

            // Set up listener for progress and results
            let sliceStats: any = null;
            let prepareStats: any = null;

            engine.setListener((event: any) => {
                console.log('[slicingService] Event:', event);

                if (event.slice) {
                    sliceStats = event.slice;
                    console.log('[slicingService] Slice complete:', sliceStats);
                }

                if (event.prepare?.done) {
                    prepareStats = event.prepare;
                    console.log('[slicingService] Prepare complete:', prepareStats);
                }

                if (event.export?.done) {
                    console.log('[slicingService] Export complete');

                    // Calculate material weight from filament length
                    const filamentLength = sliceStats?.distance || 0; // mm
                    const filamentDiameter = 1.75; // mm
                    const radius = filamentDiameter / 2;
                    const volumeMm3 = Math.PI * radius * radius * filamentLength;
                    const volumeCm3 = volumeMm3 / 1000;

                    // Material density (g/cm³)
                    const densityMap: Record<string, number> = {
                        pla: 1.24,
                        abs: 1.04,
                        petg: 1.27,
                        tpu: 1.21,
                        wood: 1.28,
                        carbon: 1.30,
                    };

                    const density = densityMap[config.material] || 1.24;
                    const materialGrams = volumeCm3 * density;

                    resolve({
                        time: sliceStats?.time || 0,
                        material: materialGrams,
                        layers: sliceStats?.layers || 0,
                        gcode: event.export.done,
                    });
                }
            });

            // Configure process settings
            const processSettings = {
                sliceHeight: layerHeight,
                sliceShells: 3,
                sliceTopLayers: 3,
                sliceBottomLayers: 3,
                sliceFillSparse: config.infill / 100,
                sliceFillType: 'hex',
                sliceSupport: config.supports,
                sliceSupportDensity: config.supports ? 0.15 : 0,
                sliceSupportSize: 6,
                sliceSupportOffset: 1,
                sliceSupportGap: 1,
                outputTemp: config.material === 'pla' ? 200 :
                    config.material === 'abs' ? 250 :
                        config.material === 'petg' ? 230 :
                            config.material === 'tpu' ? 220 : 210,
                outputBedTemp: config.material === 'pla' ? 60 :
                    config.material === 'abs' ? 100 :
                        config.material === 'petg' ? 80 : 60,
                outputFanSpeed: config.material === 'pla' ? 255 :
                    config.material === 'abs' ? 0 : 128,
            };

            // Configure device settings
            const deviceSettings = {
                bedWidth: 220,
                bedDepth: 220,
                bedHeight: 250,
                nozzleSize: nozzleSize,
                filamentSize: 1.75,
                maxSpeed: 60,
            };

            console.log('[slicingService] Parsing model...');

            // Parse the model
            await engine.parse(buffer, fileType);

            console.log('[slicingService] Setting mode to FDM...');
            engine.setMode('FDM');

            console.log('[slicingService] Configuring settings...');
            engine.setProcess(processSettings);
            engine.setDevice(deviceSettings);

            console.log('[slicingService] Starting slice...');
            await engine.slice();

            console.log('[slicingService] Preparing toolpaths...');
            await engine.prepare();

            console.log('[slicingService] Exporting G-code...');
            await engine.export();

        } catch (error) {
            console.error('[slicingService] Error:', error);
            reject(error);
        }
    });
}
