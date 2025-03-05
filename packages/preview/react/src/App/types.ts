import { StoryTree } from '../tree/types';
import { ExternalsFactory } from '../types';

export type CreateStoryViewProps = ExternalsFactory<unknown> & {
  stories: StoryTree[];
};
