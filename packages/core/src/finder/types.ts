import type { Page } from 'playwright';

export type Finder = {
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-role
   */
  getByRole(role: ByRole['role'], options?: ByRoleOptions): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-text
   */
  getByText(text: TextMatch, options?: ByText['options']): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-label
   */
  getByLabel(text: TextMatch, options?: ByLabel['options']): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-placeholder
   */
  getByPlaceholder(text: TextMatch, options?: ByPlaceholder['options']): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-alt-text
   */
  getByAltText(text: TextMatch, options?: ByAltText['options']): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-title
   */
  getByTitle(text: TextMatch, options?: ByTitle['options']): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-locator
   */
  locator(selector: string): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-filter
   */
  filter(options: WithFilterOptions): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-nth
   */
  nth(index: number): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-first
   */
  first(): Finder;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-last
   */
  last(): Finder;
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

type ByRoleOptions = Parameters<Page['getByRole']>[1];

export type ByRole = {
  type: 'role';
  role: Parameters<Page['getByRole']>[0];
  options: JSONTextMatchOptions<ByRoleOptions>;
};

export type ByText = { type: 'text' } & ByTextLike;

export type ByLabel = { type: 'label' } & ByTextLike;

export type ByPlaceholder = { type: 'placeholder' } & ByTextLike;

export type ByAltText = { type: 'alt-text' } & ByTextLike;

export type ByTitle = { type: 'title' } & ByTextLike;

type ByTextLike = {
  text: JSONTextMatch;
  options?: { exact?: boolean };
};

export type BySelector = {
  type: 'selector';
  selector: string;
};

export type WithAnd = {
  type: 'and';
  condition: FinderMeta;
};

type WithFilterOptions = {
  has?: Finder;
  hasNot?: Finder;
  hasText?: TextMatch;
  hasNotText?: TextMatch;
};

export type WithFilter = {
  type: 'filter';
  options: {
    has?: FinderMeta;
    hasNot?: FinderMeta;
    hasText?: JSONTextMatch;
    hasNotText?: JSONTextMatch;
  };
};

export type ByIndex = {
  type: 'index';
  options:
    | {
        kind: 'first';
      }
    | {
        kind: 'last';
      }
    | {
        kind: 'nth';
        at: number;
      };
};

export type JSONTextMatchOptions<TOptions> = {
  [TKey in keyof TOptions]: RegExp extends TOptions[TKey]
    ? Exclude<TOptions[TKey], RegExp> | JSONRegExp
    : TOptions[TKey];
};

export type TextMatchOptions<TOptions> = {
  [TKey in keyof TOptions]: JSONRegExp extends TOptions[TKey]
    ? Exclude<TOptions[TKey], JSONRegExp> | RegExp
    : TOptions[TKey];
};

export type JSONTextMatch = string | JSONRegExp;
export type TextMatch = string | RegExp;

export type JSONRegExp = {
  pattern: string;
  flags: string;
};
