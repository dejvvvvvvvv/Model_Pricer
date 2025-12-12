// src/pages/model-upload/components/useKiriFrame.js
import { useEffect, useRef, useState, useCallback } from 'react';

// Konstanty
const KIRI_ORIGIN = 'https://grid.space';
const KIRI_FRAME_URL = `${KIRI_ORIGIN}/kiri/?view=frame&quiet=1&nogrid=1`;

function loadKiriScript() {
  // zajistí načtení https://grid.space/code/kiri.js a dostupnost window.kiri.api
  return new Promise((resolve, reject) => {
    if (window.kiri?.api) return resolve();
    const s = document.createElement('script');
    s.src = `${KIRI_ORIGIN}/code/kiri.js`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = (e) => reject(new Error('Kiri script load failed'));
    document.head.appendChild(s);
  });
}

function waitForApi(timeout = 15000) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    const iv = setInterval(() => {
      if (window.kiri?.api?.setFrame) {
        clearInterval(iv);
        resolve(window.kiri.api);
      } else if (Date.now() - t0 > timeout) {
        clearInterval(iv);
        reject(new Error('Kiri Frame API not ready (timeout)'));
      }
    }, 50);
  });
}

function parseGcodeStats(gcodeText) {
  // primárně čteme námi vložené makra; fallback na běžné tagy
  const out = { timeSec: null, filamentMM: null, layers: null };

  const mTime = gcodeText.match(/^[;#]\s*time\s*=\s*([0-9.]+)/mi) 
             || gcodeText.match(/^[;#]\s*TIME\s*[:=]\s*([0-9.]+)/mi);
  const mMat  = gcodeText.match(/^[;#]\s*material\s*=\s*([0-9.]+)/mi) 
             || gcodeText.match(/^[;#].*filament.*?([0-9.]+)\s*mm/mi);
  const mLay  = gcodeText.match(/^[;#]\s*layers\s*=\s*([0-9]+)/mi);

  if (mTime) out.timeSec = Number(mTime[1]);
  if (mMat)  out.filamentMM = Number(mMat[1]);
  if (mLay)  out.layers = Number(mLay[1]);

  return out;
}

export function useKiriFrame() {
  const iframeRef = useRef(null);
  const [ready, setReady] = useState(false);
  const apiRef = useRef(null);

  // 1) boot – nahrát skript, počkat na API, připojit frame
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadKiriScript();
        const api = await waitForApi();
        apiRef.current = api;

        const ifr = document.createElement('iframe');
        ifr.src = KIRI_FRAME_URL;
        ifr.style.position = 'absolute';
        ifr.style.width = '1px';
        ifr.style.height = '1px';
        ifr.style.opacity = '0';
        ifr.style.pointerEvents = 'none';
        ifr.setAttribute('aria-hidden', 'true');
        document.body.appendChild(ifr);
        iframeRef.current = ifr;

        await new Promise((r, j) => {
          const timer = setTimeout(() => j(new Error('Kiri frame load timeout')), 15000);
          ifr.onload = () => { clearTimeout(timer); r(); };
        });

        // kritický krok – napojení na iframe
        api.setFrame(ifr, KIRI_ORIGIN);

        // pro jistotu „mode FDM“
        api.setMode('FDM');

        setReady(true);
      } catch (e) {
        console.warn(e);
      }
    })();

    return () => {
      cancelled = true;
      try {
        if (iframeRef.current) {
          iframeRef.current.remove();
          iframeRef.current = null;
        }
      } catch {}
    };
  }, []);

  // 2) veřejná API – zpracování modelu (ArrayBuffer) + parametry
  const processModel = useCallback(async ({ arrayBuffer, params }) => {
    // params: { layerHeight, nozzle, infillPct, filamentDiameter, materialDensity }
    if (!ready || !apiRef.current) throw new Error('Kiri not ready');
    const api = apiRef.current;

    // přenastavení device / process (jednoduché minimum)
    // – infill v Kiri je "sparse" 0..1
    const sparse = Math.max(0, Math.min(1, (params.infillPct ?? 20) / 100));

    // vložíme makra do footeru, ať máme jasná data v G-code
    const footer = [
      '; time={time}',        // sekundy
      '; material={material}',// mm filamentu
      '; layers={layers}',    // vrsty
    ].join('\n');

    api.setDevice({
      gcode: { footer }, // Kiri app to akceptuje
      // případně: filament průměr do device
      extruders: 1,
      device: { filamentDiameter: params.filamentDiameter ?? 1.75 },
    });

    api.setProcess({
      slice: { height: params.layerHeight ?? 0.2 },
      output: { nozzle: params.nozzle ?? 0.4 },
      fill: { sparse }, // pozor: v Kiri je to "fill.sparse"
      firstLayer: { height: params.layerHeight ?? 0.2 },
    });

    // 1) předání dat modelu
    await api.parse(arrayBuffer, 'stl'); // nebo 'obj' – typ detekuješ u souboru

    // 2) pipe: slice -> prepare -> export
    await api.slice();
    await api.prepare();

    const gcode = await new Promise((resolve, reject) => {
      try {
        api.export((gc) => resolve(gc));
      } catch (e) {
        reject(e);
      }
    });

    const stats = parseGcodeStats(gcode || '');
    return { gcode, stats }; // stats: { timeSec, filamentMM, layers }
  }, [ready]);

  return { ready, processModel };
}
