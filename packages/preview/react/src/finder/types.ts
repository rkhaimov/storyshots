import { FinderMeta } from '@storyshots/core';

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
