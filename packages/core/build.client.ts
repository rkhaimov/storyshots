import { build } from 'esbuild';
import fs from 'node:fs';

void main();

async function main() {
  await build({
    entryPoints: ['./src/client/index.tsx'],
    outdir: 'lib/client',
    bundle: true,
    platform: 'browser',
    minify: true,
  });

  fs.copyFileSync('src/client/index.html', 'lib/client/index.html');
}
