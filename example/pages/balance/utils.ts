export function createNeverEndingPromise() {
  return new Promise<never>(() => {});
}
