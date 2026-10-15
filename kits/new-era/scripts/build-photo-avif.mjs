// Progressive AVIF delivery from the existing, graded WebP assets.
// The originals, dimensions and crop positions remain unchanged.
import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync, existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const source = join(process.cwd(), 'public/images/work');
const output = join(process.cwd(), 'public/images/optimized');
mkdirSync(output, { recursive: true });
const files = readdirSync(source).filter(name => name.endsWith('.webp'));
let next = 0, built = 0;
sharp.concurrency(1);
async function worker() {
  while (next < files.length) {
    const name = files[next++];
    const input = join(source, name);
    const target = join(output, name.replace(/\.webp$/, '.avif'));
    if (existsSync(target) && statSync(target).mtimeMs >= statSync(input).mtimeMs) continue;
    const temp = `${target}.tmp`;
    await sharp(input).avif({ quality: 50, effort: 2 }).toFile(temp);
    renameSync(temp, target);
    built++;
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
console.log(`build-photo-avif: ${built} variants built; ${files.length} WebP originals retained`);
