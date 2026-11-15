import {defineConfig} from 'vite';
const version = process.env.GITHUB_SHA || String(Date.now());
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  define: {'import.meta.env.VITE_APP_VERSION': JSON.stringify(version)},
  plugins: [{
    name: 'app-version',
    generateBundle() {
      this.emitFile({type: 'asset', fileName: 'version.json', source: JSON.stringify({version})});
    }
  }]
});
