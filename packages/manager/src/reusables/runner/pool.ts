import { repeat } from '../repeat';

export function pool(
  factories: ReadonlyArray<() => Promise<unknown>>,
  config: { size: number },
): Promise<unknown> {
  const state = Array.from(factories);

  const workers = repeat(config.size, work);

  return Promise.all(workers);

  function work() {
    const current = state.shift();

    if (current === undefined) {
      return;
    }

    return current().finally(work);
  }
}
