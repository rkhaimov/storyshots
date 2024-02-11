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

type HoverAction = {
  action: 'hover';
  payload: {
    on: FinderMeta;
  };
};

type WaitAction = {
  action: 'wait';
  payload: {
    ms: number;
  };
};

export type ScreenshotAction = {
  action: 'screenshot';
  payload: {
    name: ScreenshotName;
  };
};

export type ActionMeta =
  | ClickAction
  | FillAction
  | HoverAction
  | WaitAction
  | ScreenshotAction;

export type NonScreenshotAction = Exclude<ActionMeta, ScreenshotAction>;
