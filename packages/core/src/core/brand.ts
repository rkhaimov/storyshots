export type Brand<TType, TProperty extends string> = TType & {
  [Key in `__${TProperty}`]: TProperty;
};

export type SubBrand<
  TBrand extends Brand<unknown, never>,
  TProperty extends string,
> = Brand<TBrand, TProperty>;
