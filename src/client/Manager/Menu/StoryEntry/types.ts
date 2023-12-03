import { SerializableStoryNode } from '../../../reusables/channel';
import { Props as ParentProps } from '../types';

export type Props = ParentProps & {
  story: SerializableStoryNode;
};
