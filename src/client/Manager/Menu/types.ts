import { SerializableStoryshotsNode } from '../../reusables/channel';
import { UseBehaviourProps } from '../behaviour/types';

export type Props = UseBehaviourProps & {
  stories: SerializableStoryshotsNode[];
  level: number;
};
