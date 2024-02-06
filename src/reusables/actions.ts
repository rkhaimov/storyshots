import { FinderMeta } from './finder';
import { ScreenshotName } from './types';

type ClickAction = {
  action: 'click';
  payload: {
    on: FinderMeta;
  };
};

export type ScreenshotAction = {
  action: 'screenshot';
  payload: {
    name: ScreenshotName;
  };
};

export type ActionMeta = ClickAction | ScreenshotAction;

export type NonScreenshotAction = Exclude<ActionMeta, ScreenshotAction>;
