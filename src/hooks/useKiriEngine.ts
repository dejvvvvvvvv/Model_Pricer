import { useState, useEffect, useRef } from 'react';
import { loadKiri } from '../lib/kiri/loadKiri';

export type KiriEngineState = {
  loading: boolean;
  ready: boolean;
  error: string | null;
  engine: any | null;
};

export function useKiriEngine() {
  const [state, setState] = useState<KiriEngineState>({
    loading: true,
    ready: false,
    error: null,
    engine: null,
  });
  const engineRef = useRef<any>(null);

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      setState(s => ({ ...s, loading: true, error: null }));
      try {
        console.log('[useKiriEngine] Loading Kiri module...');
        const kiriModule = await loadKiri();
        if (isCancelled) return;

        if (!kiriModule?.newEngine) {
          throw new Error('Invalid Kiri module loaded - newEngine not found');
        }

        console.log('[useKiriEngine] Creating engine instance...');
        // Create a new engine instance
        const engineInstance = kiriModule.newEngine();
        if (isCancelled) return;

        console.log('[useKiriEngine] Engine ready!');
        engineRef.current = engineInstance;
        setState({ loading: false, ready: true, error: null, engine: engineInstance });

      } catch (err: any) {
        console.error('[useKiriEngine] Failed to load Kiri Engine:', err);
        if (!isCancelled) {
          setState({ loading: false, ready: false, error: err.message || String(err), engine: null });
        }
      }
    }

    init();

    return () => {
      isCancelled = true;
      if (engineRef.current?.destroy) {
        engineRef.current.destroy();
      }
    };
  }, []);

  return state;
}
