// Pricing service for calculating print costs
export type MaterialPricing = {
    pricePerGram: number; // Kč per gram
    name: string;
};

export type PricingConfig = {
    material: string;
    materialGrams: number;
    printTimeSeconds: number;
    quantity: number;
    expressDelivery: boolean;
    postProcessing: string[]; // IDs of selected post-processing options
};

export type PricingResult = {
    materialCost: number;
    timeCost: number;
    postProcessingCost: number;
    expressCost: number;
    subtotal: number;
    total: number;
    breakdown: {
        label: string;
        amount: number;
    }[];
};

// Material prices per gram (Kč)
export const MATERIAL_PRICES: Record<string, MaterialPricing> = {
    pla: { pricePerGram: 0.5, name: 'PLA' },
    abs: { pricePerGram: 0.6, name: 'ABS' },
    petg: { pricePerGram: 0.7, name: 'PETG' },
    tpu: { pricePerGram: 1.2, name: 'TPU' },
    wood: { pricePerGram: 0.8, name: 'Wood Fill' },
    carbon: { pricePerGram: 1.5, name: 'Carbon Fiber' },
};

// Price per hour of printing (Kč)
export const PRICE_PER_HOUR = 100;

// Post-processing prices (Kč per piece)
export const POST_PROCESSING_PRICES: Record<string, number> = {
    sanding: 50,
    painting: 120,
    assembly: 200,
    drilling: 80,
};

export function calculatePrice(config: PricingConfig): PricingResult {
    const materialPricing = MATERIAL_PRICES[config.material] || MATERIAL_PRICES.pla;

    // Material cost
    const materialCost = config.materialGrams * materialPricing.pricePerGram * config.quantity;

    // Time cost (convert seconds to hours)
    const printTimeHours = config.printTimeSeconds / 3600;
    const timeCost = printTimeHours * PRICE_PER_HOUR * config.quantity;

    // Post-processing cost
    const postProcessingCost = config.postProcessing.reduce((sum, optionId) => {
        return sum + (POST_PROCESSING_PRICES[optionId] || 0);
    }, 0) * config.quantity;

    // Subtotal before express
    const subtotal = materialCost + timeCost + postProcessingCost;

    // Express delivery adds 50%
    const expressCost = config.expressDelivery ? subtotal * 0.5 : 0;

    // Total
    const total = subtotal + expressCost;

    // Breakdown for display
    const breakdown = [
        { label: 'Materiál', amount: materialCost },
        { label: 'Čas tisku', amount: timeCost },
    ];

    if (postProcessingCost > 0) {
        breakdown.push({ label: 'Dodatečné služby', amount: postProcessingCost });
    }

    if (expressCost > 0) {
        breakdown.push({ label: 'Expresní tisk (+50%)', amount: expressCost });
    }

    return {
        materialCost,
        timeCost,
        postProcessingCost,
        expressCost,
        subtotal,
        total,
        breakdown,
    };
}

export function formatPrice(amount: number): string {
    return `${Math.round(amount)} Kč`;
}

export function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
        return `${minutes} min`;
    }

    return `${hours}h ${minutes}min`;
}
