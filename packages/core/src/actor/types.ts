import { Finder, FinderMeta } from '../finder/types';
import { ScreenshotName } from '../screenshot';

export type ActorTransformer = (actor: Actor) => Actor;

export type Actor = {
  hover(on: Finder): Actor;
  click(on: Finder, options?: ClickOptions): Actor;
  fill(on: Finder, text: string, options?: FillOptions): Actor;
  wait(ms: number): Actor;
  screenshot(name: string): Actor;
  scrollTo(to: Finder): Actor;
  select(on: Finder, ...values: string[]): Actor;
  uploadFile(on: Finder, ...paths: string[]): Actor;
  do(transformer: ActorTransformer): Actor;
  toMeta(): ActionMeta[];
};

export type ClickAction = {
  action: 'click';
  payload: {
    on: FinderMeta;
    options?: ClickOptions;
  };
};

export type FillAction = {
  action: 'fill';
  payload: {
    on: FinderMeta;
    text: string;
    options?: FillOptions;
  };
};

export type HoverAction = {
  action: 'hover';
  payload: {
    on: FinderMeta;
  };
};

export type WaitAction = {
  action: 'wait';
  payload: {
    ms: number;
  };
};

export type ScrollToAction = {
  action: 'scrollTo';
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

export type SelectAction = {
  action: 'select';
  payload: {
    on: FinderMeta;
    values: string[];
  };
};

export type UploadFileAction = {
  action: 'uploadFile';
  payload: {
    on: FinderMeta;
    paths: string[];
  };
};

export type ActionMeta =
  | ClickAction
  | FillAction
  | HoverAction
  | WaitAction
  | ScrollToAction
  | ScreenshotAction
  | SelectAction
  | UploadFileAction;

type ClickOptions = Partial<{
  button: 'left' | 'right' | 'middle' | 'back' | 'forward';
  count: number;
  delay: number;
  offset: { x: number; y: number };
}>;

type FillOptions = Partial<{ delay: number }>;
