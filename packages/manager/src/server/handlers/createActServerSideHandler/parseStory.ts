import { StoryID } from '@storyshots/core';
import { Request } from 'express';
import { DeviceAndActions } from '../../../reusables/types';
import { Story } from '../../reusables/types';

export function parseStory(request: Request<{ id: string }>): Story {
  return {
    id: request.params.id as StoryID,
    payload: request.body as DeviceAndActions,
  };
}
