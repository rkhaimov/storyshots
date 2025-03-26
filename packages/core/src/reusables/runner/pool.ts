import { repeat } from '../repeat';

export async function pool(
  factories: ReadonlyArray<() => Promise<unknown>>,
  config: { size: number },
): Promise<void> {
  const state = Array.from(factories);

  const workers = repeat(config.size, work);

  await Promise.all(workers);

  async function work() {
    while (true) {
      const current = state.shift();

      if (current === undefined) {
        return;
      }

      try {
        await current();
      } catch (_) {
        /* empty */
      }
    }
  }
}
