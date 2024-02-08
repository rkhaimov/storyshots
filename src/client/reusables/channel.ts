import { ActionMeta } from '../../reusables/actions';
import { StoryID } from '../../reusables/types';
import { Devices } from '../create-configure-client/types';

export type FromManagerToPreviewMessage = {
  type: 'select-story';
  story: StoryID | undefined;
  screenshotting: boolean;
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
  modes: Devices;
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
