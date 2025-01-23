import type { Locator } from 'playwright';
import { Finder, FinderMeta } from '../finder/types';
import { ScreenshotName } from '../screenshot';

export type ActorTransformer = (actor: Actor) => Actor;

export type Actor = {
  /**
   * https://playwright.dev/docs/api/class-locator#locator-hover
   */
  hover(on: Finder, options?: HoverAction['payload']['options']): Actor;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-click
   */
  click(on: Finder, options?: ClickAction['payload']['options']): Actor;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-fill
   */
  fill(
    on: Finder,
    text: string,
    options?: FillAction['payload']['options'],
  ): Actor;
  /**
   * https://playwright.dev/docs/api/class-frame#frame-wait-for-timeout
   */
  wait(ms: number): Actor;
  /**
   * Takes intermediate screenshots.
   * When called at the end of actor functions override default final screenshot name (which is 'FINAL').
   *
   * @param name Name of screenshot. Should not contain any special characters or non latin words
   */
  screenshot(name: string): Actor;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-scroll-into-view-if-needed
   */
  scrollTo(to: Finder, options?: ScrollToAction['payload']['options']): Actor;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-select-option
   */
  select(
    on: Finder,
    values: SelectAction['payload']['values'],
    options?: SelectAction['payload']['options'],
  ): Actor;
  /**
   * https://playwright.dev/docs/api/class-keyboard#keyboard-press
   */
  press(input: string): Actor;
  /**
   * https://playwright.dev/docs/api/class-keyboard#keyboard-down
   */
  down(input: string): Actor;
  /**
   * https://playwright.dev/docs/api/class-keyboard#keyboard-up
   */
  up(input: string): Actor;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-clear
   */
  clear(on: Finder, options?: ClearAction['payload']['options']): Actor;
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
  /**
   * https://playwright.dev/docs/api/class-locator#locator-highlight
   */
  highlight(on: Finder): Actor;
  /**
   * https://playwright.dev/docs/api/class-locator#locator-drag-to
   */
  drag(draggable: Finder, to: Finder): Actor;
  /**
   * Allows to compose different complex scenarios on actor.
   *
   * @example
   *
   * function enterCredentials(): ActorTransformer {
   *     return (actor) => actor.getByRole(...)
   * }
   *
   * actor.do(enterCredentials())
   */
  do(transformer: ActorTransformer): Actor;
  /**
   * Stops doing anything after this point. Useful for debugging purposes
   */
  stop(): Actor;
  toMeta(): ActionMeta[];
};

export type HoverAction = {
  action: 'hover';
  payload: {
    on: FinderMeta;
    options?: Parameters<Locator['hover']>[0];
  };
};

export type ClickAction = {
  action: 'click';
  payload: {
    on: FinderMeta;
    options: Parameters<Locator['click']>[0];
  };
};

export type FillAction = {
  action: 'fill';
  payload: {
    on: FinderMeta;
    text: string;
    options?: Parameters<Locator['fill']>[1] & { fast: boolean };
  };
};

export type ScrollToAction = {
  action: 'scrollTo';
  payload: {
    on: FinderMeta;
    options?: Parameters<Locator['scrollIntoViewIfNeeded']>[0];
  };
};

export type SelectAction = {
  action: 'select';
  payload: {
    on: FinderMeta;
    values: Parameters<Locator['selectOption']>[0];
    options?: Parameters<Locator['selectOption']>[1];
  };
};

export type KeyboardAction = {
  action: 'keyboard';
  payload: {
    type: 'press' | 'up' | 'down';
    input: string;
  };
};

export type ClearAction = {
  action: 'clear';
  payload: {
    on: FinderMeta;
    options?: Parameters<Locator['clear']>[0];
  };
};

export type WaitAction = {
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

export type UploadFileAction = {
  action: 'uploadFile';
  payload: {
    chooser: FinderMeta;
    paths: string[];
  };
};

export type HighlightAction = {
  action: 'highlight';
  payload: {
    on: FinderMeta;
  };
};

export type DragAction = {
  action: 'drag';
  payload: {
    draggable: FinderMeta;
    to: FinderMeta;
    options?: Parameters<Locator['dragTo']>[1];
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
  | KeyboardAction
  | ClearAction
  | HighlightAction
  | DragAction;
