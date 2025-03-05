/**
 * Pauses execution for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to wait.
 * @returns A promise that resolves after the specified delay.
 *
 * @example
 * // Wait for 1 second
 * await wait(1000);
 */
export function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Throws an error indicating that a method is not implemented.
 *
 * @param method - The name of the method that is not implemented.
 * @throws Error Will always throw an error with the message that the method is not implemented.
 *
 * @example
 * function myMethod() {
 *   notImplemented('myMethod');
 * }
 */
export function notImplemented(method: string): never {
  assert(false, `${method} is not implemented`);
}

/**
 * Asserts that a given input is of type 'never'.
 * This function is useful for exhaustive checks in TypeScript.
 *
 * @param input - The value that should never occur.
 * @throws Error Will always throw an error if called.
 *
 * @example
 * type Shape = 'circle' | 'square';
 * function getArea(shape: Shape) {
 *   switch (shape) {
 *     case 'circle':
 *       // handle circle
 *       break;
 *     case 'square':
 *       // handle square
 *       break;
 *     default:
 *       assertIsNever(shape);
 *   }
 * }
 */
export function assertIsNever(input: never): never {
  throw new Error('Should never be called');
}

/**
 * Asserts that a value is neither null nor undefined.
 *
 * @param input - The value to check.
 * @param message - The error message to throw if the assertion fails. Defaults to 'Expected to be defined'.
 * @throws Will throw an error if the input is null or undefined.
 *
 * @example
 * const value: string | null = getValue();
 * assertNotEmpty(value, 'Value should not be null');
 * // Now TypeScript knows that 'value' is a string
 */
export function assertNotEmpty<T>(
  input: T | undefined | null,
  message = 'Expected to be defined',
): asserts input is T {
  if (isNil(input)) {
    throw new Error(message);
  }
}

/**
 * Asserts that a condition is true.
 *
 * @param input - The condition to evaluate.
 * @param message - The error message to throw if the assertion fails. Defaults to 'Assertion is false'.
 * @throws Will throw an error if the input evaluates to false.
 *
 * @example
 * const isValid = checkValidity();
 * assert(isValid, 'The value is not valid');
 */
export function assert(
  input: unknown,
  message = 'Assertion is false',
): asserts input {
  if (!input) {
    throw new Error(message);
  }
}

/**
 * Checks if a value is null or undefined.
 *
 * @param input - The value to check.
 * @returns True if the input is null or undefined, false otherwise.
 *
 * @example
 * const value = getValue();
 * if (isNil(value)) {
 *   // handle null or undefined
 * } else {
 *   // proceed with non-null value
 * }
 */
export function isNil(input: unknown): input is null | undefined {
  return input === undefined || input === null;
}
