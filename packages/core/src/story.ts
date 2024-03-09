import { ActionMeta } from './actions';
import { IntermediateNode, LeafNode, LeafNodeID } from './tree';

export type StoryID = LeafNodeID;

export type PureStory = LeafNode<{
  title: string;
  actions: ActionMeta[];
}>;

export type PureGroup = IntermediateNode<
  { title: string },
  PureStory['payload']
>;

export type PureStoryTree = PureGroup | PureStory;
