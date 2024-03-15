import { ActionMeta } from './actions';
import { Brand } from './brand';
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

export type PurePresetGroup = {
  name: PresetConfigName;
  default: PresetName;
  additional: PresetName[];
};

export type PresetConfigName = Brand<string, 'PresetConfigName'>;
export type PresetName = Brand<string, 'PresetName'>;
