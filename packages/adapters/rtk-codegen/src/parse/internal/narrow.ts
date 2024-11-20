import assert from 'assert';

type Diver<TOrigin> = {
  /**
   * Ensures that element satisfies given type predicate and destructs it immediately.
   * @param test type predicate
   * @param destruct destructor applied to asserted type
   */
  ensure<TNarrow extends TOrigin, TDestruct>(
    test: (input: TOrigin) => input is TNarrow,
    destruct: (input: TNarrow) => TDestruct,
  ): Diver<TDestruct>;
  fold(): TOrigin;
};

/**
 * Runtime type assertions.
 */
export function narrow<TOrigin>(value: TOrigin): Diver<TOrigin> {
  return {
    ensure: (test, destruct) => {
      assert(test(value));

      const destructed = destruct(value);

      return narrow(destructed);
    },
    fold: () => value,
  };
}
