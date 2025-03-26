import { mapAll } from '../../transformers';
import { createGroupID, createStoryID } from '../story-id';
import { StoryTree } from '../types';
import { Group, Story, StoryAttributes, StoryPayload } from './types';

export const __bindStoryFactories = <TExternals>() => {
  return {
    it: (
      title: string,
      config: Partial<StoryPayload<TExternals>> & StoryAttributes<TExternals>,
    ): StoryTree<TExternals> => {
      return {
        id: createStoryID(title),
        type: 'story',
        title,
        act: (actor) => actor,
        arrange: (externals) => externals,
        retries: () => 0,
        ...config,
      } satisfies Story<TExternals>;
    },
    describe: (
      title: string,
      children: StoryTree<TExternals>,
    ): StoryTree<TExternals> => {
      const groupID = createGroupID(title);

      return {
        id: groupID,
        type: 'group',
        title,
        children: mapAll(
          children,
          (story) => ({ ...story, id: createStoryID(story.id, groupID) }),
          (group) => ({ ...group, id: createGroupID(group.id, groupID) }),
        ),
      } satisfies Group<TExternals>;
    },
    each: <T>(
      elements: T[],
      onEach: (element: T) => StoryTree<TExternals>,
    ): StoryTree<TExternals> => {
      return elements.map(onEach);
    },
  };
};
