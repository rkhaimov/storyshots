export interface APIType {
  endpoints: Record<
    string,
    { Types: { QueryArg: unknown; ResultType: unknown } }
  >;
  enhanceEndpoints: (input: never) => unknown;
}

export type ExtractRtkAPI<T extends APIType> = {
  [TKey in keyof T['endpoints']]: (
    arg: T['endpoints'][TKey]['Types']['QueryArg'],
  ) => Promise<T['endpoints'][TKey]['Types']['ResultType']>;
};
