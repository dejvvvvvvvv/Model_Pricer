declare global {
  interface Window {
    kiri?: { newEngine?: any };
    Engine?: any;
  }
}

export type KiriLoadOptions = {
  src?: string;
  fallbackSrc?: string;
  timeoutMs?: number;
};

let _loadingPromise: Promise<{ newEngine: any } | null> | null = null;

function resolveEngineFromWindow() {
  const newEngine = window.kiri?.newEngine || window.Engine;
  if (!newEngine) return null;
  return { newEngine };
}

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.async = true;
    el.src = src;
    el.onload = () => resolve();
    el.onerror = (e) => reject(new Error(`load_error:${src}`));
    document.head.appendChild(el);
  });
}

export async function loadKiri(opts: KiriLoadOptions = {}): Promise<{ newEngine: any } | null> {
  const existing = resolveEngineFromWindow();
  if (existing) return existing;

  if (_loadingPromise) return _loadingPromise;

  const {
    src = '/code/engine.js',
    fallbackSrc,
    timeoutMs = 12000,
  } = opts;

  _loadingPromise = new Promise<any>(async (resolve, reject) => {
    const timer = setTimeout(() => {
      _loadingPromise = null;
      reject(new Error(`timeout:${src}`));
    }, timeoutMs);

    async function tryLoad(url: string) {
      await injectScript(url);
      const loaded = resolveEngineFromWindow();
      if (!loaded) {
        throw new Error(`engine_missing_after_load:${url}`);
      }
      return loaded;
    }

    try {
      let resolvedEngine;
      try {
        resolvedEngine = await tryLoad(src);
      } catch (e1) {
        console.error(`Primary source failed: ${e1}`);
        if (fallbackSrc) {
          console.log(`Falling back to: ${fallbackSrc}`);
          resolvedEngine = await tryLoad(fallbackSrc);
        } else {
          throw e1;
        }
      }
      clearTimeout(timer);
      resolve(resolvedEngine);
    } catch (err) {
      _loadingPromise = null;
      clearTimeout(timer);
      reject(err);
    }
  });

  return _loadingPromise;
}
