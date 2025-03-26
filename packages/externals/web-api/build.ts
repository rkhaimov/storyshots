import { build } from 'tsup';

void build({
  entry: ['src/index.ts'],
  outDir: 'lib',
  platform: 'browser',
  target: 'node18',
  format: 'cjs',
  dts: true,
});
