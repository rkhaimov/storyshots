import { Story, StoryConfig, StoryTree } from './story';

export type ActiveStory =
  | undefined
  | {
      story: Story;
      config: StoryConfig;
    };

declare global {
  interface Window {
    onPreviewReady(stories: StoryTree): ActiveStory;
  }
}
