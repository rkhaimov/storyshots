export type FinderMeta = {
  beginning: Selector;
  consequent: Array<Selector | Index | Filter>;
};

export type Selector = {
  type: 'selector';
  on: string;
};

type Filter = {
  type: 'filter';
  has: FinderMeta;
};

type Index = {
  type: 'index';
  at: number;
};
