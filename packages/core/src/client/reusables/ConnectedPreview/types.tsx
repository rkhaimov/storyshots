import { ActiveStory, StoryTree } from '@core';

export type PreviewConnectionProps = {
  identity: string;
  onPreviewLoaded(stories: StoryTree): ActiveStory;
};
