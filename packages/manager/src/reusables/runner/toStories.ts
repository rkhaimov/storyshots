import { PureStory, PureStoryTree } from '@storyshots/core';

export function toStories(stories: PureStoryTree[]): PureStory[] {
  return stories.flatMap((story) =>
    story.type === 'group' ? toStories(story.children) : [story],
  );
}
