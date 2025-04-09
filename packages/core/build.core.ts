import { build } from 'tsup';

void build({
  entry: {
    index: './src/core/public.ts',
    ['manager']: './src/server/index.ts',
  },
  outDir: 'lib',
  platform: 'node',
  target: 'node18',
  format: ['cjs'],
  dts: true,
});
