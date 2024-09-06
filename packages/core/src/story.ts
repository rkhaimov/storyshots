import { Actor } from './actor/types';
import { StoryConfig } from './test-config';
import { IntermediateNode, LeafNode, LeafNodeID } from './tree';

export type StoryID = LeafNodeID;

export type PureStory = LeafNode<{
  title: string;
  act(actor: Actor, config: StoryConfig): Actor;
}>;

export type PureGroup = IntermediateNode<
  { title: string },
  PureStory['payload']
>;

export type PureStoryTree = PureGroup | PureStory;
