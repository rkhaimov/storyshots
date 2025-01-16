type SupportedAriaAttrs = Partial<Record<'name', string>>;

export type Finder = {
  /**
   * Finds an element semantically.
   * @param role is a value under name attribute on accessibility tree view.
   * @param attrs can be passed for additional narrowing and is matched by exact comparison.
   * @example
   * <button>Create</button>
   *
   * getByRole('button', { name: 'Create' })
   */
  getByRole(role: string, attrs?: SupportedAriaAttrs): Finder;
  /**
   * Finds deepest element containing specified text.
   * @param substring a text to match with, by inclusion.
   * @example
   * <div><span>Hello, friend!<span></div>
   *
   * getByText('friend') // returns span element
   */
  getByText(substring: string): Finder;
  /**
   * Finds element whose placeholder attribute is exactly like specified
   * @example
   * <input placeholder="Enter your name" />
   *
   * getByPlaceholder('Enter your name')
   */
  getByPlaceholder(placeholder: string): Finder;
  /**
   * Finds element whose title attribute is exactly like specified
   * @example
   * <span title="Hint!">Text</span>
   *
   * getByTitle('Hint!')
   */
  getByTitle(title: string): Finder;
  /**
   * Finds label containing specified text by substring OR an element that specifies aria-label attribute with exact match.
   * It is better to use getByRole as it is more flexible
   * @example
   * <label>Hello, friend!</label>
   *
   * getByLabel('friend')
   * @example
   * <p aria-label="friend">Hello, friend!</p>
   *
   * getByLabel('friend')
   */
  getByLabel(label: string): Finder;
  /**
   * Finds element by given selector. Supports https://pptr.dev/guides/page-interactions#selectors
   * @example
   * <div><button>Create</button></div>
   *
   * getBySelector('div > button') // returns button
   */
  getBySelector(selector: string): Finder;
  /**
   * Leaves elements that have at least one child satisfying given criteria.
   * @param selector a condition to test against.
   * @example
   * <ul>
   *     <li>
   *       <h1>Leonard</h1>
   *       <button>Delete</button>
   *     </li>
   *     <li>
   *       <h1>Johny</h1>
   *       <button>Delete</button>
   *     </li>
   * </ul>
   *
   * getByRole('listitem')
   *   .has(getByText('Johny'))
   *   .getByRole('button', { name: 'Delete' }) // returns second li element
   */
  has(selector: Finder): Finder;
  /**
   * Takes element by its index starting from zero
   * @example
   * <ul>
   *     <li>Leonard</li>
   *     <li>Johny</li>
   * </ul>

   * getByRole('listitem')
   *   .at(1) // returns <li>Johny</li>
   */
  at(index: number): Finder;
  /**
   * Test found elements against provided conditions with AND rule
   * @example
   * <button title="Hint!">Action</button>
   *
   * getByRole('button')
   *   .and(getByTitle('Title of a button'))
   */
  and(selector: Finder): Finder;
  /**
   * Allows to extend finder
   * @param transformer transforms a finder by returning its new version
   * @example
   * <ul>
   *     <li>Leonard</li>
   *     <li>Johny</li>
   * </ul>
   *
   * const byListItemName =
   *   (name: string): FinderTransformer =>
   *   (finder) =>
   *     finder.getByRole('listitem', { name });
   *
   * get(byListItemName('Johny'))
   */
  get(transformer: FinderTransformer): Finder;
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
