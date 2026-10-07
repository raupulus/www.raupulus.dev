import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const outPublic = path.join(rootDir, '.output/public');

if (!fs.existsSync(outPublic)) {
    fs.mkdirSync(outPublic, { recursive: true });
}

// 1. Copiar archivos estáticos de public/
const publicDir = path.join(rootDir, 'public');
if (fs.existsSync(publicDir)) {
    fs.cpSync(publicDir, outPublic, { recursive: true });
    console.warn('✅ Copiado public/ a .output/public/');
}

// 2. Copiar bundle cliente de Vite (_nuxt)
const clientNuxtDir = path.join(rootDir, '.nuxt/dist/client/_nuxt');
const fallbackNuxtDir = path.join(rootDir, 'node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt');
const targetNuxtDir = path.join(outPublic, '_nuxt');

const sourceNuxtDir = fs.existsSync(clientNuxtDir) ? clientNuxtDir : (fs.existsSync(fallbackNuxtDir) ? fallbackNuxtDir : null);
if (sourceNuxtDir) {
    fs.cpSync(sourceNuxtDir, targetNuxtDir, { recursive: true });
    console.warn(`✅ Copiado ${sourceNuxtDir} a .output/public/_nuxt/`);
} else {
    console.error('❌ Error: No se encontró el directorio del build cliente _nuxt');
    process.exit(1);
}

// 3. Copiar fuentes descargadas de @nuxt/fonts (_fonts)
const fontsCacheDir = path.join(rootDir, 'node_modules/.cache/nuxt/fonts/meta/data/fonts');
const targetFontsDir = path.join(outPublic, '_fonts');
if (fs.existsSync(fontsCacheDir)) {
    fs.mkdirSync(targetFontsDir, { recursive: true });
    const fontFiles = fs.readdirSync(fontsCacheDir).filter((f) => f.endsWith('.woff2') || f.endsWith('.woff'));
    for (const f of fontFiles) {
        fs.copyFileSync(path.join(fontsCacheDir, f), path.join(targetFontsDir, f));
    }
    console.warn(`✅ Copiadas ${fontFiles.length} fuentes a .output/public/_fonts/`);
}
