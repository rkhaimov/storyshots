export function pool(
  factories: ReadonlyArray<() => Promise<unknown>>,
  config: { size: number },
): Promise<unknown> {
  const state = Array.from(factories);

  const workers = new Array(config.size).fill(undefined).map(work);

  return Promise.all(workers);

  function work() {
    const current = state.shift();

    if (current === undefined) {
      return;
    }

    return current().finally(work);
  }
}
