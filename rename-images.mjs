// rename-images.mjs
// Renombra todos los .jpg/.jpeg de un directorio a "image-<n>.jpg"
// Uso:
//   node rename-images.mjs <inputDir> [--start=1] [--pad=0] [--by=name|mtime] [--dry]
//
// Ejemplos:
//   node rename-images.mjs ./assets/original
//   node rename-images.mjs ./assets/original --start=1 --pad=3
//   node rename-images.mjs ./assets/original --by=mtime --dry

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const [, , INPUT_DIR, ...args] = process.argv;
if (!INPUT_DIR) {
  console.error("❌ Uso: node rename-images.mjs <inputDir> [--start=1] [--pad=0] [--by=name|mtime] [--dry]");
  process.exit(1);
}

const opts = {
  start: 1,
  pad: 0,
  by: "name", // o "mtime"
  dry: false,
};

for (const a of args) {
  if (a.startsWith("--start=")) opts.start = parseInt(a.split("=")[1], 10) || 1;
  if (a.startsWith("--pad=")) opts.pad = parseInt(a.split("=")[1], 10) || 0;
  if (a.startsWith("--by=")) opts.by = a.split("=")[1] === "mtime" ? "mtime" : "name";
  if (a === "--dry") opts.dry = true;
}

const VALID_EXT = new Set([".jpg", ".jpeg"]);

function padNum(n, pad) {
  return pad > 0 ? String(n).padStart(pad, "0") : String(n);
}

async function listImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (!VALID_EXT.has(ext)) continue;
    const full = path.join(dir, e.name);
    const stat = await fs.stat(full);
    files.push({ name: e.name, full, ext, stat });
  }
  // Orden configurable
  if (opts.by === "mtime") {
    files.sort((a, b) => a.stat.mtimeMs - b.stat.mtimeMs);
  } else {
    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
  }
  return files;
}

function targetName(index, ext) {
  const num = padNum(index, opts.pad);
  return `image-${num}${ext}`;
}

async function main() {
  const abs = path.resolve(INPUT_DIR);
  const list = await listImages(abs);
  if (list.length === 0) {
    console.log("ℹ️ No se encontraron .jpg/.jpeg en:", abs);
    return;
  }

  // Primera pasada: renombrar a nombres temporales para evitar colisiones
  const plan = [];
  let n = opts.start;
  for (const f of list) {
    const finalName = targetName(n++, ".jpg"); // fuerza a .jpg
    const finalPath = path.join(abs, finalName);
    plan.push({ from: f.full, temp: tempNameFor(f.full), to: finalPath });
  }

  console.log(`📝 Archivos a procesar: ${list.length}`);
  if (opts.dry) {
    plan.forEach((p, i) => {
      console.log(`DRY ${i + 1}: ${path.basename(p.from)}  ->  ${path.basename(p.to)}`);
    });
    return;
  }

  // Pasada 1: mover a temporales
  for (const p of plan) {
    // Si el destino temporal ya existe, genera otro
    let tmp = p.temp;
    while (await exists(tmp)) tmp = tempNameFor(p.from);
    await fs.rename(p.from, tmp);
    p.temp = tmp;
  }

  // Pasada 2: mover de temporales a finales
  for (const p of plan) {
    // Si el final ya existe (raro), elige el siguiente número libre
    let final = p.to;
    let idx = 1;
    while (await exists(final)) {
      const dir = path.dirname(final);
      const base = path.basename(final, ".jpg");
      final = path.join(dir, `${base}-${idx++}.jpg`);
    }
    await fs.rename(p.temp, final);
    console.log(`✔ ${path.basename(p.from)}  ->  ${path.basename(final)}`);
  }

  console.log("\n✅ Renombrado completo.");
}

function tempNameFor(fullPath) {
  const dir = path.dirname(fullPath);
  const rnd = crypto.randomBytes(4).toString("hex");
  return path.join(dir, `.tmp-${rnd}-${path.basename(fullPath)}`);
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

main().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
