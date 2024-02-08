import { AriaRole } from 'react';
import { ActionMeta } from '../reusables/actions';
import { FinderMeta } from '../reusables/finder';
import { JournalRecord, StoryID } from '../reusables/types';

export type StoryshotsNode = Group | Story;

export type Group = {
  id: string;
  type: 'group';
  title: string;
  children: StoryshotsNode[];
};

// Covariant relation is intentional here
export type Story<out TExternals = unknown> = {
  id: StoryID;
  type: 'story';
  title: string;
  arrange(externals: TExternals, journal: Journal): TExternals;
  act(actor: Actor): Actor;
  render(externals: TExternals): React.ReactNode;
};

export type Actor = {
  click(on: Finder): Actor;
  fill(on: Finder, text: string): Actor;
  screenshot(name: string): Actor;
  toMeta(): ActionMeta[];
};

type SupportedAriaAttrs = Partial<Record<'name', string>>;

export type Finder = {
  getByRole(role: AriaRole, attrs?: SupportedAriaAttrs): Finder;
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

export type Journal = {
  record<TArgs extends unknown[], TReturn>(
    method: string,
    fn: (...args: TArgs) => TReturn,
  ): (...args: TArgs) => TReturn;
  read(): JournalRecord[];
};
