// Gera a logo otimizada e os favicons a partir do arquivo oficial.
// Uso: npm run logo   (requer logo-original.png na raiz do projeto)
import { existsSync } from "node:fs";
import sharp from "sharp";

const SRC = "logo-original.png";
if (!existsSync(SRC)) {
  console.error(`Arquivo ${SRC} não encontrado na raiz do projeto.`);
  process.exit(1);
}

const meta = await sharp(SRC).metadata();
console.log(`Logo original: ${meta.width}x${meta.height}`);

await sharp(SRC).resize({ width: 512, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile("public/logo.png");
// A logo é circular e legível em tamanhos pequenos: o favicon usa o próprio símbolo, sem alteração de cores.
await sharp(SRC).resize(512, 512, { fit: "contain", background: { r: 23, g: 26, b: 33, alpha: 1 } }).png().toFile("src/app/icon.png");
await sharp(SRC).resize(180, 180, { fit: "contain", background: { r: 23, g: 26, b: 33, alpha: 1 } }).png().toFile("src/app/apple-icon.png");
await sharp(SRC).resize(1200, 630, { fit: "contain", background: { r: 23, g: 26, b: 33, alpha: 1 } }).png().toFile("public/og-image.png");
console.log("Gerados: public/logo.png, src/app/icon.png, src/app/apple-icon.png, public/og-image.png");
