import { ActionMeta } from '../../reusables/actions';
import { IntermediateNode, LeafNode } from '../../reusables/tree';
import { Devices } from '../create-configure-client/types';

export type EvaluatedStory = LeafNode<{
  title: string;
  actions: ActionMeta[];
  devices: Devices;
}>;

export type EvaluatedGroup = IntermediateNode<
  { title: string },
  EvaluatedStory['payload']
>;

export type EvaluatedStoryTree = EvaluatedGroup | EvaluatedStory;
