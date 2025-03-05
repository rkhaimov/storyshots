import { StoryID } from '@storyshots/core';
import { DeviceAndActions } from '../../reusables/types';

export type Story = {
  id: StoryID;
  payload: DeviceAndActions;
};
