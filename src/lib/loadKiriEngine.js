// src/lib/loadKiriEngine.js
export async function loadKiriEngine() {
  if (typeof window === 'undefined') throw new Error('Engine must run in browser');

  const w = window;
  if (w.__kiriEnginePromise) return w.__kiriEnginePromise;

  w.__kiriEnginePromise = new Promise((resolve, reject) => {
    // už je načteno?
    if (w.Engine || w.kiri?.Engine) {
      return resolve(w.Engine || w.kiri?.Engine);
    }

    const s = document.createElement('script');
    s.src = 'https://grid.space/code/engine.js'; // oficiální hostovaná verze
    s.async = true;
    s.onload = () => {
      const Engine = w.Engine || w.kiri?.Engine;
      if (!Engine) return reject(new Error('Kiri Engine missing on window'));
      resolve(Engine);
    };
    s.onerror = () => reject(new Error('Failed to load https://grid.space/code/engine.js'));
    document.head.appendChild(s);
  });

  return w.__kiriEnginePromise;
}