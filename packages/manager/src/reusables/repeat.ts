export function repeat<T>(n: number, factory: () => T): T[] {
  return new Array(n).fill(undefined).map(factory);
}
