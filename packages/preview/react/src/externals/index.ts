import { assertNotEmpty, Channel } from '@storyshots/core';
import { IExternals } from './types';

export const externals: IExternals = {
  createManagerConnection: (preview) => {
    const parent = window.parent;

    assertNotEmpty(parent, 'Preview should be wrapped in manager');

    return (parent as never as Channel).state(preview);
  },
};
