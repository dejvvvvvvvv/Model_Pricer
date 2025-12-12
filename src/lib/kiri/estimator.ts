type EstimateInput = {
  file: File;            // STL/OBJ/3MF
  profile?: any;         // tiskový profil (nozzle, layerHeight, infill, materialDensity, atd.)
};

export type EstimateResult = {
  grams?: number;
  seconds?: number;
  notes?: string[];
};

export async function estimatePrint(input: EstimateInput): Promise<EstimateResult> {
  // TODO: až bude k dispozici stabilní API Kiri pro headless odhad,
  // zavolej příslušný entry-point (např. load model -> slice -> stats).
  // Zde jen skeleton:
  if (!(window as any).kiri) throw new Error('kiri_not_loaded');
  const notes: string[] = [];

  // DEMO: zatím jen vrátíme placeholder
  notes.push('Kiri loaded. Připojím reálný výpočet v dalším kroku.');
  return { grams: undefined, seconds: undefined, notes };
}
