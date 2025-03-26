/* eslint-disable @typescript-eslint/no-implied-eval */

export function callback<T extends (...args: never) => unknown, R, E>(
  fn: T,
  handle: (args: [R, T]) => E,
): (arg: R) => E {
  return new Function(
    'arg',
    `return (${handle.toString()})([arg, ${fn.toString()}])`,
  ) as (arg: R) => E;
}

export function merge<A, B, C, D>(
  left: (arg: A) => B,
  right: (arg: C) => D,
): () => [(arg: A) => B, (arg: C) => D] {
  return new Function(
    `return [${left.toString()}, ${right.toString()}]`,
  ) as () => [(arg: A) => B, (arg: C) => D];
}
