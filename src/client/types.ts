import { AriaRole } from 'react';
import { ActionMeta, AriaAttrs, SelectorMeta } from '../reusables/actions';
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
  act(actor: Actor, finder: Finder): Actor;
  render(externals: TExternals): React.ReactNode;
};

export type Actor = {
  click(finder: Finder): Actor;
  screenshot(name: string): Actor;
  toMeta(): ActionMeta[];
};

export type Finder = {
  getByRole(role: AriaRole, attrs?: AriaAttrs): Finder;
  toMeta(): SelectorMeta;
};

export type Journal = {
  record<TArgs extends unknown[], TReturn>(
    method: string,
    fn: (...args: TArgs) => TReturn,
  ): (...args: TArgs) => TReturn;
  read(): JournalRecord[];
};
