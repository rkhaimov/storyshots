import fs from 'fs';
import path from 'path';

export function createTempFolder() {
  const folder = path.join(__dirname, 'temp');

  fs.rmSync(folder, { recursive: true, force: true });
  fs.mkdirSync(folder);

  return (sub: string) => path.join(folder, sub);
}

export type TempFolder = ReturnType<typeof createTempFolder>;
