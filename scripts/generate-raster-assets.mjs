import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../public/', import.meta.url);
const brand = new URL('brand/', root);
await mkdir(fileURLToPath(brand), { recursive: true });

const mark = fileURLToPath(new URL('wrapsheet-mark.svg', brand));
const og = fileURLToPath(new URL('wrapsheet-og.svg', brand));

await Promise.all([
  sharp(mark, { density: 320 })
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(fileURLToPath(new URL('wrapsheet-icon-180.png', brand))),
  sharp(mark, { density: 320 })
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(fileURLToPath(new URL('wrapsheet-icon-512.png', brand))),
  sharp(og, { density: 192 })
    .resize(1200, 630)
    .png({ compressionLevel: 9 })
    .toFile(fileURLToPath(new URL('wrapsheet-og.png', brand))),
]);

console.log('Generated Wrapsheet icon and social-card PNG assets.');
