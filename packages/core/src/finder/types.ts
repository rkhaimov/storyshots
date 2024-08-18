type SupportedAriaAttrs = Partial<Record<'name', string>>;

export type Finder = {
  getByRole(role: string, attrs?: SupportedAriaAttrs): Finder;
  getByText(substring: string): Finder;
  getByPlaceholder(placeholder: string): Finder;
  getByLabel(label: string): Finder;
  getBySelector(selector: string): Finder;
  has(element: Finder): Finder;
  at(index: number): Finder;
  toMeta(): FinderMeta;
};

// FinderFactory contains only selector methods from Finder
// TODO: Automate selectors picking
export type FinderFactory = Pick<
  Finder,
  | 'getBySelector'
  | 'getByRole'
  | 'getByText'
  | 'getByPlaceholder'
  | 'getByLabel'
>;

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
