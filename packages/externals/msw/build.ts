import { build } from 'tsup';

void build({
  entry: ['src/index.tsx'],
  outDir: 'lib',
  platform: 'browser',
  target: 'node18',
  format: 'esm',
  dts: true,
});
