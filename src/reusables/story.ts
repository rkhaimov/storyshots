import { ActionMeta } from './actions';
import { TestPresets } from './test-presets';
import { IntermediateNode, LeafNode, LeafNodeID } from './tree';

export type StoryID = LeafNodeID;

export type PureStory = LeafNode<{
  title: string;
  actions: ActionMeta[];
  devices: TestPresets;
}>;

export type PureGroup = IntermediateNode<
  { title: string },
  PureStory['payload']
>;

export type PureStoryTree = PureGroup | PureStory;
