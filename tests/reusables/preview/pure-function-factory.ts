/* eslint-disable @typescript-eslint/no-implied-eval */

/**
 * @fileOverview Provides utility functions for working with Unary Pure Functions (UPFs) that can be serialized.
 * UPFs are functions that take a single argument and produce no side effects, making them suitable for serialization
 * and transmission across different JavaScript environments.
 */

/**
 * Wraps a Unary Pure Function (UPF) with a handler function (which is also UPF), resulting in a new UPF.
 *
 * This function allows you to combine a given UPF (`fn`) with a handler (`handle`) that processes the function and its argument,
 * producing a new function that can be serialized and executed in different JavaScript environments.
 *
 * @param fn - A Unary Pure Function to be wrapped.
 * @param handle - A function to act upon (`fn`).
 * @returns A new Unary Pure Function that applies the handler to the argument and the original function.
 *
 * @example
 * ```typescript
 * // Original function that doubles a number
 * const double = (x: number) => x * 2;
 *
 * // Handler that applies the function and adds 10 to the result
 * const handler = ([arg, func]: [number, typeof double]) => func(arg) + 10;
 *
 * // Create a new function using callback
 * const constructed = callback(double, handler);
 *
 * // Execute the new function
 * console.log(constructed(5)); // Output: 20
 * ```
 */
export function callback<T extends (...args: never) => unknown, R, E>(
  fn: T,
  handle: (args: [R, T]) => E,
): (arg: R) => E {
  return new Function(
    'arg',
    `return (${handle.toString()})([arg, ${fn.toString()}])`,
  ) as (arg: R) => E;
}

/**
 * Merges two Unary Pure Functions (UPFs) into a single function that returns both.
 *
 * This function combines two UPFs (`left` and `right`) into a new function that, when invoked,
 * returns an array containing both original functions. This is useful for serializing and transmitting
 * multiple functions together across different JavaScript environments.
 *
 * @param left - The first Unary Pure Function to merge.
 * @param right - The second Unary Pure Function to merge.
 * @returns A new function that returns an array containing the two original functions.
 *
 * @example
 * ```typescript
 * // First function that adds 5 to a number
 * const addFive = (x: number) => x + 5;
 *
 * // Second function that multiplies a number by 3
 * const multiplyByThree = (x: number) => x * 3;
 *
 * // Merge the two functions
 * const merged = merge(addFive, multiplyByThree);
 *
 * // Using merged to construct complex behaviour
 * const constructed = callback(merged, ([n, merged]: [number, typeof merged]) => {
 *    const [_addFive, _multiplyByThree] = merged();
 *
 *    return { added: _addFive(n), multiplied: _multiplyByThree(n) };
 * });
 *
 * // Execute the functions
 * console.log(constructed(10)); // Output: { added: 15, multiplied: 30 }
 * ```
 */
export function merge<A, B, C, D>(
  left: (arg: A) => B,
  right: (arg: C) => D,
): () => [(arg: A) => B, (arg: C) => D] {
  return new Function(
    `return [${left.toString()}, ${right.toString()}]`,
  ) as () => [(arg: A) => B, (arg: C) => D];
}
