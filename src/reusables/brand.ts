export type Brand<TType, TName extends string> = TType & {
  [Key in `__${TName}`]: TName;
};

export type ChildBrand<
  TBrand extends Brand<unknown, never>,
  TName extends string,
> = Brand<TBrand, TName>;
