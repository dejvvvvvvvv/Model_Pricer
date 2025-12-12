// API client for slicing service
const API_BASE_URL = 'http://192.168.1.213:3001';

export type SlicingConfig = {
    quality: 'nozzle_08' | 'nozzle_06' | 'nozzle_04' | 'draft' | 'standard' | 'fine' | 'ultra';
    infill: number; // 10-100
    material: 'pla' | 'abs' | 'petg' | 'tpu' | 'wood' | 'carbon';
    supports: boolean;
};

export type SlicingResult = {
    time: number; // seconds
    material: number; // grams
    layers: number;
    success: boolean;
    message?: string;
};

export async function sliceModel(
    file: File,
    config: SlicingConfig
): Promise<SlicingResult> {
    const formData = new FormData();
    formData.append('model', file);
    formData.append('config', JSON.stringify(config));

    const response = await fetch(`${API_BASE_URL}/api/slice`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Slicing failed');
    }

    return await response.json();
}
