import type { Page } from 'playwright';

export type Finder = {
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-role
   */
  getByRole(role: ByRole['role'], options?: ByRole['options']): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-text
   */
  getByText(text: ByText['text'], options?: ByText['options']): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-label
   */
  getByLabel(text: ByLabel['text'], options?: ByLabel['options']): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-placeholder
   */
  getByPlaceholder(
    text: ByPlaceholder['text'],
    options?: ByPlaceholder['options'],
  ): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-alt-text
   */
  getByAltText(text: ByAltText['text'], options?: ByAltText['options']): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-title
   */
  getByTitle(text: ByTitle['text'], options?: ByTitle['options']): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-locator
   */
  getBySelector(selector: string): Finder;
  /**
   * Only has option is implemented.
   *
   * https://playwright.dev/docs/api/class-locator#locator-filter
   */
  has(selector: Finder): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-nth
   */
  at(index: number): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-and
   */
  and(selector: Finder): Finder;
  /**
   * Allows to compose different complex selectors on finder.
   *
   * @example
   *
   * function byButtonSeverity(severity): FinderTransformer {
   *     return (finder) => finder.getByRole(...)
   * }
   *
   * finder.get(byButtonSeverity('error'))
   */
  get(transformer: FinderTransformer): Finder;
  /**
   * Allows to pass RegExp values to matchers that expect it.
   *
   * @example
   *
   * finder.getByText(finder.r(/submit/i))
   */
  r(pattern: RegExp): RegExpMatcher;
  __toMeta(): FinderMeta;
};

export type FinderTransformer = (finder: Finder) => Finder;

export type FinderMeta = {
  beginning: ByLocator;
  consequent: Array<ByLocator | ByIndex | WithFilter | WithAnd>;
};

export type ByLocator = {
  type: 'locator';
  by:
    | ByRole
    | ByText
    | ByLabel
    | ByPlaceholder
    | ByAltText
    | ByTitle
    | BySelector;
};

export type ByRole = {
  type: 'role';
  role: Parameters<Page['getByRole']>[0];
  options:
    | (Parameters<Page['getByRole']>[1] & { name: never })
    | { name: string | RegExpMatcher }
    | undefined;
};

export type ByText = { type: 'text' } & ByTextLike;

export type ByLabel = { type: 'label' } & ByTextLike;

export type ByPlaceholder = { type: 'placeholder' } & ByTextLike;

export type ByAltText = { type: 'alt-text' } & ByTextLike;

export type ByTitle = { type: 'title' } & ByTextLike;

type ByTextLike = {
  text: string | RegExpMatcher;
  options?: { exact?: boolean };
};

export type RegExpMatcher = {
  source: string;
  flags: string;
};

export type BySelector = {
  type: 'selector';
  selector: string;
};

export type WithAnd = {
  type: 'and';
  condition: FinderMeta;
};

export type WithFilter = {
  type: 'filter';
  has: FinderMeta;
};

export type ByIndex = {
  type: 'index';
  at: number;
};
