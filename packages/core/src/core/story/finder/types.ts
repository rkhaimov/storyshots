import type { Page } from 'playwright';

export type Finder = {
  getByRole(role: ByRole['role'], options?: ByRoleOptions): Finder;

  getByText(text: TextMatch, options?: ByText['options']): Finder;

  getByLabel(text: TextMatch, options?: ByLabel['options']): Finder;

  getByPlaceholder(text: TextMatch, options?: ByPlaceholder['options']): Finder;

  getByAltText(text: TextMatch, options?: ByAltText['options']): Finder;

  getByTitle(text: TextMatch, options?: ByTitle['options']): Finder;

  locator(selector: string): Finder;

  filter(options: WithFilterOptions): Finder;

  nth(index: number): Finder;

  first(): Finder;

  last(): Finder;

  and(selector: Finder): Finder;

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
  options: ByRoleOptions;
};

export type ByText = { type: 'text' } & ByTextLike;

export type ByLabel = { type: 'label' } & ByTextLike;

export type ByPlaceholder = { type: 'placeholder' } & ByTextLike;

export type ByAltText = { type: 'alt-text' } & ByTextLike;

export type ByTitle = { type: 'title' } & ByTextLike;

type ByTextLike = {
  text: TextMatch;
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
    hasText?: TextMatch;
    hasNotText?: TextMatch;
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

export type TextMatch = string | RegExp;
