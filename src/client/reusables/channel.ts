import { ActionMeta } from '../../reusables/actions';
import { StoryID } from '../../reusables/types';
import { FinalClientConfig, Modes } from '../create-configure-client/types';

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
  modes: Modes;
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
