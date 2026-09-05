import sharp from "sharp";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
await sharp(fileURLToPath(new URL("design/orbit/orbit-preview.png", root)))
  .resize(600)
  .png({ palette: true, quality: 85 })
  .toFile(fileURLToPath(new URL("public/models/orbit-poster.png", root)));
