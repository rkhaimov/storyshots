import { build } from 'tsup';

void build({
  entry: ['src/index.ts'],
  outDir: 'lib',
  platform: 'node',
  target: 'node18',
  dts: true,
});
