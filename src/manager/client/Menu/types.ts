import { PureStoryTree } from '../../../reusables/story';
import { UseBehaviourProps } from '../behaviour/types';

export type Props = UseBehaviourProps & {
  stories: PureStoryTree[];
  level: number;
};
