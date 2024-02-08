import { FinderMeta } from './finder';
import { ScreenshotName } from './types';

type ClickAction = {
  action: 'click';
  payload: {
    on: FinderMeta;
  };
};

type FillAction = {
  action: 'fill';
  payload: {
    on: FinderMeta;
    text: string;
  };
};

export type ScreenshotAction = {
  action: 'screenshot';
  payload: {
    name: ScreenshotName;
  };
};

export type ActionMeta = ClickAction | FillAction | ScreenshotAction;

export type NonScreenshotAction = Exclude<ActionMeta, ScreenshotAction>;
