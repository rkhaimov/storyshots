export async function createPromiseFromGenerator<TIntermediate, TResult>(
  generator: AsyncGenerator<TIntermediate, TResult, unknown>,
  onIntermediate: (intermediate: TIntermediate) => void,
  signal: AbortSignal,
): Promise<TResult> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    signal.throwIfAborted();

    const step = await generator.next();

    if (step.done) {
      return step.value;
    }

    onIntermediate(step.value);
  }
}
