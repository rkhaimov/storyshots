import { ActionMeta } from '../../reusables/actions';
import { StoryID } from '../../reusables/types';

export type FromManagerToPreviewMessage = {
  type: 'select-story';
  story: StoryID | undefined;
};

export type FromPreviewToManagerMessage = {
  type: 'stories-changed';
  stories: SerializableStoryshotsNode[];
};

export type SerializableStoryNode = {
  id: StoryID;
  type: 'story';
  title: string;
  actions: ActionMeta[];
};

export type SerializableGroupNode = {
  id: string;
  type: 'group';
  title: string;
  children: SerializableStoryshotsNode[];
};

export type SerializableStoryshotsNode =
  | SerializableGroupNode
  | SerializableStoryNode;
