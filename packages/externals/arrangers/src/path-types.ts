type _PathOf<T, TKey extends keyof T> = TKey extends string
  ? T[TKey] extends Record<string, unknown>
    ? TKey | `${TKey}.${_PathOf<T[TKey], keyof T[TKey]>}`
    : TKey
  : never;

export type PathsOf<T> = _PathOf<T, keyof T>;

export type GetByPath<TPath extends string, TType> = TPath extends keyof TType
  ? TType[TPath]
  : TPath extends `${infer THead extends keyof TType & string}.${infer TRest}`
    ? GetByPath<TRest, TType[THead]>
    : unknown;
