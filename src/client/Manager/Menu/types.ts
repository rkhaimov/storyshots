import { EvaluatedStoryTree } from '../../reusables/channel';
import { UseBehaviourProps } from '../behaviour/types';

export type Props = UseBehaviourProps & {
  stories: EvaluatedStoryTree[];
  level: number;
};
