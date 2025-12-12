import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
   outDir: "build",
   chunkSizeWarningLimit: 2000,
  },
  plugins: [
    tsconfigPaths(), 
    react(),
    // This plugin copies the Kiri:Moto engine files to the build directory
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: 'public/kiri/**/*',
    //       dest: 'kiri'
    //     }
    //   ]
    // })
  ],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  }
});
