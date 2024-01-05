export function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function assertNotEmpty<T>(
  input: T | undefined | null,
  message: string,
): asserts input is T {
  if (input === undefined || input === null) {
    throw new Error(message);
  }
}

export function assert(input: unknown, message = 'Assertion is false'): asserts input {
  if (input === false) {
    throw new Error(message);
  }
}
