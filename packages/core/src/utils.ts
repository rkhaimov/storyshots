export function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function assertIsNever(input: never) {
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
  if (input === false) {
    throw new Error(message);
  }
}

export function not(input: boolean) {
  return !input;
}

export function isNil<T>(
  input: T | null | undefined,
): input is null | undefined {
  return input === undefined || input === null;
}
