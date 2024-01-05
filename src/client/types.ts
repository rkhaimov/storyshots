import { AriaRole } from 'react';
import { ActorMeta, AriaAttrs, FinderMeta } from '../reusables/actions';

export type Node = Group | Story;

export type Group = {
  type: 'group';
  title: string;
  children: Node[];
};

export type Story = {
  type: 'story';
  title: string;
  act?(actor: Actor, finder: Finder): Actor;
  render(): React.ReactNode;
};

export type Actor = {
  click(finder: Finder): Actor;
  toMeta(): ActorMeta[];
};

export type Finder = {
  getByRole(role: AriaRole, attrs?: AriaAttrs): Finder;
  toMeta(): FinderMeta;
};
