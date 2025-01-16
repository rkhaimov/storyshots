export function pool(
  factories: ReadonlyArray<() => Promise<unknown>>,
  config: { size: number },
): Promise<unknown> {
  const state = Array.from(factories);

  const workers = new Array(config.size).fill(undefined).map(work);

  return Promise.all(workers);

  // async is important here for throwIfAborted to be wrapped in promise rejection object
  async function work() {
    const current = state.shift();

    if (current === undefined) {
      return;
    }

    return current().finally(work);
  }
}
