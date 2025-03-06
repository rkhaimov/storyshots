import { StoryTree } from './types';

export function describe(title: string, children: Group['children']): Group {
  return { type: 'group', title, children };
}

export type Group = {
  type: 'group';
  title: string;
  children: StoryTree[];
};
