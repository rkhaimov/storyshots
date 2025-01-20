import { TreeOP } from '@storyshots/core';
import { Request } from 'express';
import { ActionsAndConfig } from '../../../reusables/types';
import { Story } from '../../reusables/types';

export function parseStory(request: Request<{ id: string }>): Story {
  return {
    id: TreeOP.ensureIsLeafID(request.params.id),
    payload: request.body as ActionsAndConfig,
  };
}
