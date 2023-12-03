import { StoryID } from '../../reusables/types';
import { assertNotEmpty, not } from '../../reusables/utils';

type StoryshotsNodeLike =
  | { id: string; type: 'group'; children: StoryshotsNodeLike[] }
  | StoryNodeLike;

type StoryNodeLike = { id: StoryID; type: 'story' };

export function findStoryLikeByID<T extends StoryshotsNodeLike>(nodes: T[], id: StoryID) {
  const result = _findStoryByID(nodes, id);

  assertNotEmpty(result, `Story was not found by given id: ${id}`);

  return result as Extract<T, { type: 'story' }>;
}

function _findStoryByID(
  stories: StoryshotsNodeLike[],
  id: StoryID,
): StoryNodeLike | undefined {
  if (stories.length === 0) {
    return undefined;
  }

  const [head, ...tail] = stories;

  if (head.type === 'story') {
    return head.id === id ? head : _findStoryByID(tail, id);
  }

  const inside = id.includes(head.id);

  if (not(inside)) {
    return _findStoryByID(tail, id);
  }

  return _findStoryByID(head.children, id);
}
