type SupportedAriaAttrs = Partial<Record<'name', string>>;

export type Finder = {
  // Finds an element by its role which is computed using aria accessibility tree.
  // Name attribute can be passed for additional narrowing and is matched by exact comparison.
  getByRole(role: string, attrs?: SupportedAriaAttrs): Finder;
  // Finds deepest element containing specified text. Matches by substring comparison
  getByText(substring: string): Finder;
  // Finds element whose placeholder attribute is exactly like specified
  getByPlaceholder(placeholder: string): Finder;
  // Finds element whose title attribute is exactly like specified
  getByTitle(title: string): Finder;
  // Finds label containing specified text by substring OR an element that specifies aria-label attribute with exact match.
  //
  // It is better to use getByRole selector for other scenarios (like aria-labelledby)
  getByLabel(label: string): Finder;
  // Finds element by given selector. Supports https://pptr.dev/guides/page-interactions#selectors
  getBySelector(selector: string): Finder;
  // Leaves elements that have at least one child satisfying given criteria
  has(selector: Finder): Finder;
  // Takes element by its index starting from zero
  at(index: number): Finder;
  // Test found elements against provided conditions with AND rule
  and(selector: Finder): Finder;
  // Allows to extend finder
  do(transformer: FinderTransformer): Finder;
  __toMeta(): FinderMeta;
};

export type FinderTransformer = (finder: Finder) => Finder;

export type FinderMeta = {
  beginning: Selector;
  consequent: Array<Selector | Index | Filter | And>;
};

export type Selector = {
  type: 'selector';
  on: string;
};

type And = {
  type: 'and';
  condition: FinderMeta;
};

type Filter = {
  type: 'filter';
  has: FinderMeta;
};

type Index = {
  type: 'index';
  at: number;
};
