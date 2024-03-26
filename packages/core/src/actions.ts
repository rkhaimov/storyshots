import { FinderMeta } from './finder';
import { ScreenshotName } from './screenshot';

export type ClickOptions = Partial<{
  button: 'left' | 'right' | 'middle' | 'back' | 'forward';
  count: number;
  delay: number;
  offset: { x: number; y: number };
}>;

type ClickAction = {
  action: 'click';
  payload: {
    on: FinderMeta;
    options?: ClickOptions;
  };
};

export type FillOptions = Partial<{ delay: number }>;

type FillAction = {
  action: 'fill';
  payload: {
    on: FinderMeta;
    text: string;
    options?: FillOptions;
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

type ScrollToAction = {
  action: 'scroll-to';
  payload: {
    on: FinderMeta;
  };
};

export type ScrollAction = {
  action: 'scroll';
  payload: {
    on?: FinderMeta;
    x: number;
    y: number;
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
  | ScrollToAction
  | ScrollAction
  | ScreenshotAction;
