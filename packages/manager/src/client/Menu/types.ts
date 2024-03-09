import { PureStoryTree } from '@storyshots/core';
import { UseBehaviourProps } from '../behaviour/types';

export type Props = UseBehaviourProps & {
  stories: PureStoryTree[];
  level: number;
};
