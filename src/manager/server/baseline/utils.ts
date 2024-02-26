import fs from 'fs';

export function exists(path: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => fs.exists(path, resolve));
}

export function mkdir(path: string): Promise<void> {
  return new Promise<void>((resolve) => fs.mkdir(path, () => resolve()));
}

export function mkfile(path: string, content: string | Buffer): Promise<void> {
  return new Promise<void>((resolve) =>
    fs.writeFile(path, content, () => resolve()),
  );
}

export function read(path: string): Promise<Buffer> {
  return new Promise((resolve) =>
    fs.readFile(path, (_, data) => resolve(data)),
  );
}

export function copy(curr: string, next: string): Promise<void> {
  return new Promise((resolve) => fs.copyFile(curr, next, () => resolve()));
}
