export type Brand<TType, TName extends string> = TType & {
  [Key in `__${TName}`]: TName;
};
