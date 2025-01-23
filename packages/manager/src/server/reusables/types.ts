import { StoryID } from '@storyshots/core';
import { ActionsAndConfig } from '../../reusables/types';

export type Story = {
  id: StoryID;
  payload: ActionsAndConfig;
};
