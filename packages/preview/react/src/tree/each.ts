import { StoryTree } from './types';

export function each<T>(
  elements: T[],
  onEach: (element: T) => StoryTree,
): StoryAggregate {
  return {
    type: 'aggregate',
    children: elements.map(onEach),
  };
}

export type StoryAggregate = {
  type: 'aggregate';
  children: StoryTree[];
};
