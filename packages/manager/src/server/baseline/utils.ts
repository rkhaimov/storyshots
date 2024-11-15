import fs from 'fs';

export function exists(path: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => fs.exists(path, resolve));
}

export function mkdir(path: string): Promise<void> {
  return fromThrowableCB((cb) =>
    fs.mkdir(path, { recursive: true }, (err) => cb(err)),
  );
}

export function mkfile(path: string, content: string | Uint8Array): Promise<void> {
  return fromThrowableCB((cb) => fs.writeFile(path, content, cb));
}

export function read(path: string): Promise<Buffer> {
  return fromThrowableCB((cb) => fs.readFile(path, cb));
}

export function copy(curr: string, next: string): Promise<void> {
  return fromThrowableCB((cb) => fs.copyFile(curr, next, cb));
}

function fromThrowableCB<T>(
  run: (cb: (error: unknown, value: T) => void) => void,
): Promise<T> {
  return new Promise((resolve, reject) =>
    run((error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    }),
  );
}
