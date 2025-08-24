// optimize-images.mjs
// Uso:
//   node optimize-images.mjs <inputDir> <outputDir> [jpgQuality] [webpQuality]
// Ejemplo:
//   node optimize-images.mjs ./assets/original ./public/img/optimized 80 82

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [, , INPUT_DIR, OUTPUT_DIR, JPG_Q_ARG, WEBP_Q_ARG] = process.argv;

// Resoluciones fijas para optimización
const SIZES = [640, 1280, 1920];

const JPG_QUALITY = JPG_Q_ARG ? parseInt(JPG_Q_ARG, 10) : 80;     // 0–100
const WEBP_QUALITY = WEBP_Q_ARG ? parseInt(WEBP_Q_ARG, 10) : 82;  // 0–100

if (!INPUT_DIR || !OUTPUT_DIR) {
  console.error("❌ Uso: node optimize-images.mjs <inputDir> <outputDir> [jpgQuality] [webpQuality]");
  console.error("📱 Resoluciones fijas: 640, 1280, 1920");
  process.exit(1);
}

// Extensiones soportadas de entrada
const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);

// Recorrido recursivo del directorio de entrada
async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function baseOutPath(inputFile, outDir) {
  const rel = path.relative(INPUT_DIR, inputFile);
  const relDir = path.dirname(rel);
  const { name } = path.parse(inputFile);
  return { relDir, name };
}

async function processOne(file) {
  const ext = path.extname(file).toLowerCase();
  if (!VALID_EXT.has(ext)) return;

  const { relDir, name } = baseOutPath(file, OUTPUT_DIR);
  const destDir = path.join(OUTPUT_DIR, relDir);
  await ensureDir(destDir);

  // Carga y normaliza (rotate por EXIF)
  const img = sharp(file, { failOn: "none" }).rotate();

  const meta = await img.metadata().catch(() => ({}));
  const origWidth = meta?.width ?? null;

  console.log(`🖼️  Procesando: ${path.basename(file)} (${origWidth || 'desconocido'}px)`);

  // Para cada tamaño objetivo fijo
  for (const targetWidth of SIZES) {
    // Evita agrandar imágenes más pequeñas
    const finalWidth = origWidth && origWidth < targetWidth ? origWidth : targetWidth;

    // WEBP
    const webpOut = path.join(destDir, `${name}-${finalWidth}.webp`);
    await img
      .clone()
      .resize({ width: finalWidth, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toFile(webpOut);

    // JPG (mozjpeg)
    const jpgOut = path.join(destDir, `${name}-${finalWidth}.jpg`);
    await img
      .clone()
      .resize({ width: finalWidth, withoutEnlargement: true })
      .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
      .toFile(jpgOut);

    console.log(`  ✅ ${finalWidth}px: ${path.basename(webpOut)}, ${path.basename(jpgOut)}`);
  }
}

(async () => {
  const t0 = Date.now();
  let count = 0;

  console.log("🚀 Iniciando optimización de imágenes...");
  console.log(`📱 Resoluciones: ${SIZES.join(', ')}px`);
  console.log(`🎨 Calidad JPG: ${JPG_QUALITY}%, WebP: ${WEBP_QUALITY}%`);
  console.log(`📁 Entrada: ${path.resolve(INPUT_DIR)}`);
  console.log(`📁 Salida: ${path.resolve(OUTPUT_DIR)}`);
  console.log("─".repeat(60));

  for await (const file of walk(INPUT_DIR)) {
    try {
      await processOne(file);
      count++;
      console.log("─".repeat(40));
    } catch (err) {
      console.error(`⚠️  Error procesando ${file}:`, err?.message || err);
    }
  }

  const ms = ((Date.now() - t0) / 1000).toFixed(1);
  console.log("─".repeat(60));
  console.log(`✅ Listo. Imágenes procesadas: ${count}. Tiempo: ${ms}s`);
  console.log(`📁 Salida: ${path.resolve(OUTPUT_DIR)}`);
})();
