export type MethodMeta = {
  url: string;
  method: string;
  arg: ArgsMeta;
  handler(input: never): Promise<unknown>;
};

type ArgsMeta =
  | { type: 'none' }
  | {
      type: 'single';
      source: PathSource | QuerySource | BodySource;
    }
  | {
      type: 'composite';
      sources: Array<Named<PathSource | QuerySource | BodySource>>;
    };

type Named<T> = { name: string } & T;

type PathSource = {
  from: 'path';
  type: 'string' | 'number' | 'boolean';
};

type QuerySource = {
  from: 'query';
  type: 'string' | 'number' | 'boolean';
};

type BodySource = { from: 'body' };
