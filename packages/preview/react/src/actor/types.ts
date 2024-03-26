import { ActionMeta, ClickOptions, FillOptions } from '@storyshots/core';

import { Finder } from '../finder/types';

export type Actor = {
  hover(on: Finder): Actor;
  click(on: Finder, options?: ClickOptions): Actor;
  fill(on: Finder, text: string, options?: FillOptions): Actor;
  wait(ms: number): Actor;
  screenshot(name: string): Actor;
  scrollTo(to: Finder): Actor;
  scroll(amount: number, on?: Finder): Actor;
  toMeta(): ActionMeta[];
};
