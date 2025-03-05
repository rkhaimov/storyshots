export function repeat<T>(n: number, factory: () => T): T[] {
  return Array.from({ length: n }, factory);
}
