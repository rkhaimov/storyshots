import type { KeyInput } from 'puppeteer';
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
  press(input: KeyInput): Actor;
  down(input: KeyInput): Actor;
  up(input: KeyInput): Actor;
  /**
   * Uploads one or multiple files.
   * @param chooser a selector to an element which will trigger file chooser when clicked.
   * @param paths a list of files. Paths must be relative to current working directory (usually a project root)
   *
   * @example
   * <input type="file" multiple />
   *
   * // uploads specified files
   * actor.uploadFile(
   *    finder.getByRole('button'),
   *    'path/to/file_0.ext',
   *    'path/to/file_1.ext'
   * )
   */
  uploadFile(chooser: Finder, ...paths: string[]): Actor;
  do(transformer: ActorTransformer): Actor;
  /**
   * Stops doing anything after this point. Useful for debugging purposes
   */
  stop(): Actor;
  toMeta(): ActionMeta[];
};

export type ClickAction = {
  action: 'click';
  payload: {
    on: FinderMeta;
    options?: ClickOptions;
  };
};

export type KeyboardAction = {
  action: 'keyboard';
  payload: {
    type: 'press' | 'up' | 'down';
    input: KeyInput;
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
    chooser: FinderMeta;
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
  | UploadFileAction
  | KeyboardAction;

type ClickOptions = Partial<{
  button: 'left' | 'right' | 'middle' | 'back' | 'forward';
  count: number;
  delay: number;
  offset: { x: number; y: number };
}>;

type FillOptions = Partial<{ delay: number }>;
