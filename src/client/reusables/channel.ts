import { ActionMeta } from '../../reusables/actions';
import { StoryID } from '../../reusables/types';
import { Devices } from '../create-configure-client/types';

export type EvaluatedStoryNode = {
  id: StoryID;
  type: 'story';
  title: string;
  actions: ActionMeta[];
  devices: Devices;
};

export type EvaluatedGroupNode = {
  id: string;
  type: 'group';
  title: string;
  children: EvaluatedStoryshotsNode[];
};

export type EvaluatedStoryshotsNode = EvaluatedGroupNode | EvaluatedStoryNode;
