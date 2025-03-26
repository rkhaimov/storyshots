export function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function assertIsNever(input: never): never {
  throw new Error('Should never be called');
}

export function assertNotEmpty<T>(
  input: T | undefined | null,
  message = 'Expected to be defined',
): asserts input is T {
  if (isNil(input)) {
    throw new Error(message);
  }
}

export function assert(
  input: unknown,
  message = 'Assertion is false',
): asserts input {
  if (!input) {
    throw new Error(message);
  }
}

export function isNil(input: unknown): input is null | undefined {
  return input === undefined || input === null;
}
