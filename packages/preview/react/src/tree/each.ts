import { StoryTree } from './types';

/**
 * Denotes an aggregate of all generated stories. This can be used inside `describe` to group related stories.
 *
 * @param elements - The array of elements to iterate over.
 * @param onEach - A function that is called on each element. It receives an element and returns a StoryTree item.
 * @returns An aggregate containing the generated children stories.
 *
 * @example
 * export const statusStories = describe('Status Updates', [
 *   it('renders no updates'),
 *   it('renders updates with content'),
 *   each(['Online', 'Offline', 'Busy'], (status) =>
 *     it(`shows user status as ${status}`)
 *   ),
 * ]);
 */
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
