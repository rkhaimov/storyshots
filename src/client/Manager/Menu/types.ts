import { EvaluatedStoryshotsNode } from '../../reusables/channel';
import { UseBehaviourProps } from '../behaviour/types';

export type Props = UseBehaviourProps & {
  stories: EvaluatedStoryshotsNode[];
  level: number;
};
