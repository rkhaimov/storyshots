import { ActionMeta } from '@storyshots/core';

import { Finder } from '../finder/types';

export type Actor = {
  hover(on: Finder): Actor;
  click(on: Finder): Actor;
  fill(on: Finder, text: string): Actor;
  wait(ms: number): Actor;
  screenshot(name: string): Actor;
  toMeta(): ActionMeta[];
};
