import { StoryTree } from '@core';
import { UseBehaviourProps } from '../behaviour/types';

export type Props = UseBehaviourProps & {
  stories: StoryTree;
  level: number;
};
