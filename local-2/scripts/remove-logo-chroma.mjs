import sharp from "sharp";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  throw new Error("Usage: node scripts/remove-logo-chroma.mjs <input> <output>");
}

const image = sharp(inputPath).ensureAlpha();
const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
const transparentAt = 24;
const opaqueAt = 210;
let minX = info.width;
let minY = info.height;
let maxX = 0;
let maxY = 0;

for (let offset = 0; offset < data.length; offset += info.channels) {
  const red = data[offset];
  const blue = data[offset + 2];
  const neutralCoverage = Math.min(red, blue);
  const matte = Math.max(
    0,
    Math.min(1, (neutralCoverage - transparentAt) / (opaqueAt - transparentAt)),
  );
  const alpha = Math.round(data[offset + 3] * matte);

  data[offset] = 255;
  data[offset + 1] = 255;
  data[offset + 2] = 255;
  data[offset + 3] = alpha;

  if (alpha > 5) {
    const pixel = offset / info.channels;
    const x = pixel % info.width;
    const y = Math.floor(pixel / info.width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
}

if (minX > maxX || minY > maxY) {
  throw new Error("No logo pixels found after chroma removal");
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: info.channels },
})
  .extract({
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  })
  .extend({
    top: 24,
    right: 24,
    bottom: 24,
    left: 24,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outputPath);
