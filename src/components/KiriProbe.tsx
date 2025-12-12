import React from 'react';
import type { KiriEngineState } from '@/hooks/useKiriEngine';

interface KiriProbeProps {
  state: KiriEngineState;
}

export default function KiriProbe({ state }: KiriProbeProps) {
  return (
    <div style={{ padding: 12, border: '1px solid #333', borderRadius: 8, margin: 12 }}>
      <h3>Kiri Engine Status: {state.loading ? 'Loading...' : state.ready ? 'Ready' : 'Error'}</h3>
      {state.error && <pre style={{ color: 'tomato' }}>{state.error}</pre>}
      {state.ready && (
        <pre style={{ whiteSpace: 'pre-wrap', color: 'green' }}>
          Engine loaded successfully!
        </pre>
      )}
    </div>
  );
}
