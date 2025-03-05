import type { Locator } from 'playwright';
import { Finder, FinderMeta } from '../finder/types';
import { ScreenshotName } from '../screenshot';

export type ActorTransformer = (actor: Actor) => Actor;

/**
 * The Actor type represents an entity that interacts with a web application during testing, performing actions such
 * as clicking, and typing.
 * It encapsulates methods that simulate user interactions, enabling the automation of complex scenarios.
 */
export type Actor = {
  /**
   * Hovers over the specified element.
   * @param on - The element to hover over.
   * @param options - Optional hover action options.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-locator#locator-hover
   * @example
   * actor.hover(finder.getByRole('button'))
   */
  hover(on: Finder, options?: HoverAction['payload']['options']): Actor;

  /**
   * Clicks on the specified element.
   * @param on - The element to click.
   * @param options - Optional click action options.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-locator#locator-click
   * @example
   * actor.click(finder.getByText('Submit'))
   */
  click(on: Finder, options?: ClickAction['payload']['options']): Actor;

  /**
   * Fills the specified element with text.
   * @param on - The element to fill.
   * @param text - The text to input.
   * @param options - Optional fill action options.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-locator#locator-fill
   * @example
   * actor.fill(finder.getByPlaceholderText('Enter your name'), 'John Doe')
   */
  fill(
    on: Finder,
    text: string,
    options?: FillAction['payload']['options'],
  ): Actor;

  /**
   * Waits for the specified duration.
   *
   * **Note:** This should only be used for debugging purposes.
   * All selectors wait automatically for elements to be visible.
   *
   * @param ms - The duration to wait in milliseconds.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-frame#frame-wait-for-timeout
   * @example
   * actor.wait(3000)
   */
  wait(ms: number): Actor;

  /**
   * Captures an intermediate screenshot during the actor's action sequence.
   * If invoked at the end of the actor chain, it overrides the default final screenshot name (which is `FINAL`).
   *
   * **Note:** The `name` parameter should not contain special characters or non-Latin characters,
   * as it will be used in the filename. Including such characters can lead to compatibility issues
   * across different operating systems. For instance, colons (":") are not permitted in Windows filenames.
   *
   * @param name - The desired name of the screenshot. Ensure it is free from special characters and non-Latin words.
   * @param options - Optional settings for capturing the screenshot. See {@link UserScreenshotOptions}
   * @returns The current Actor instance.
   *
   * @example
   * ```typescript
   * actor
   *   .do(openLoginForm())
   *   .screenshot('LoginForm', { mask: [finder.getByLabel('password')], maskColor: '#FF0000' });
   * ```
   */
  screenshot(name: string, options?: UserScreenshotOptions): Actor;

  /**
   * Scrolls the specified element into view if needed.
   * @param to - The element to scroll into view.
   * @param options - Optional scroll action options.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-locator#locator-scroll-into-view-if-needed
   * @example
   * actor.scrollTo(finder.getByRole('content'))
   */
  scrollTo(to: Finder, options?: ScrollToAction['payload']['options']): Actor;

  /**
   * Selects options in the specified element.
   * @param on - The element to select options in.
   * @param values - The values to select.
   * @param options - Optional select action options.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-locator#locator-select-option
   * @example
   * actor.select(finder.getByRole('combobox'), ['Option 1', 'Option 2'])
   */
  select(
    on: Finder,
    values: SelectAction['payload']['values'],
    options?: SelectAction['payload']['options'],
  ): Actor;

  /**
   * Presses the specified key. Can accept short-cuts.
   * @param input - The key to press.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-keyboard#keyboard-press
   * @example
   * actor.press('Enter').press('Shift+T')
   */
  press(input: string): Actor;

  /**
   * Presses the specified key down.
   * @param input - The key to press down.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-keyboard#keyboard-down
   * @example
   * actor.down('Shift')
   */
  down(input: string): Actor;

  /**
   * Releases the specified key.
   * @param input - The key to release.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-keyboard#keyboard-up
   * @example
   * actor.up('Shift')
   */
  up(input: string): Actor;

  /**
   * Clears the value of the specified element.
   * @param on - The element to clear.
   * @param options - Optional clear action options.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-locator#locator-clear
   * @example
   * actor.clear(finder.getByPlaceholder('Search'))
   */
  clear(on: Finder, options?: ClearAction['payload']['options']): Actor;

  /**
   * Uploads one or more files to the specified element.
   * @param chooser - A selector to an element that triggers the file chooser when clicked.
   * @param paths - A list of file paths relative to the current working directory.
   * @returns The current Actor instance.
   * @example
   * <input type="file" multiple />
   * // Uploads specified files
   * actor.uploadFile(finder.getByRole('button'), 'path/to/file_0.ext', 'path/to/file_1.ext')
   */
  uploadFile(chooser: Finder, ...paths: string[]): Actor;

  /**
   * Highlights the specified element. Useful for debugging purposes.
   * @param on - The element to highlight.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-locator#locator-highlight
   * @example
   * actor.highlight(finder.getByRole('button'))
   */
  highlight(on: Finder): Actor;

  /**
   * Drags the specified element to another element.
   * @param draggable - The element to drag.
   * @param to - The element to drop onto.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-locator#locator-drag-to
   * @example
   * actor.drag(finder.getByText('Drag Me'), finder.getByText('Drop Here'))
   */
  drag(draggable: Finder, to: Finder): Actor;

  /**
   * Removes focus from the specified element.
   * @param on - The element to blur.
   * @param options - Optional blur action options.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-locator#locator-blur
   * @example
   * actor.blur(finder.getByRole('button'))
   */
  blur(on: Finder, options?: BlurAction['payload']['options']): Actor;

  /**
   * Presses keys sequentially on the specified element.
   * @param on - The element to press keys on.
   * @param text - The text to type.
   * @param options - Optional blur action options.
   * @returns The current Actor instance.
   * @see https://playwright.dev/docs/api/class-locator#locator-press-sequentially
   * @example
   * actor.pressSequentially(finder.getByRole('textbox'), 'Hello!')
   */
  pressSequentially(
    on: Finder,
    text: string,
    options?: BlurAction['payload']['options'],
  ): Actor;

  /**
   * Allows composing complex scenarios by chaining actions.
   * @param transformer - A function that transforms the actor.
   * @returns The current Actor instance.
   * @example
   * function enterCredentials(): ActorTransformer {
   *     return (actor) => actor
   *                        .fill(finder.getByRole('username'), 'user')
   *                        .fill(finer.getByRole('password'), 'pass')
   * }
   * actor.do(enterCredentials())
   */
  do(transformer: ActorTransformer): Actor;

  /**
   * Stops any further actions after this point. Useful for debugging purposes.
   * Once `stop()` is called, no other actions will be executed, and the actor's flow will terminate.
   * @returns The current Actor instance.
   * @example
   * actor
   *  .hover() // Will be executed.
   *  .stop() // After this, no further actions will be executed.
   *  .click()
   *  .fill()
   */
  stop(): Actor;

  /**
   * @private
   * For internal use only
   */
  __toMeta(): ActionMeta[];
};

export type HoverAction = {
  action: 'hover';
  payload: {
    on: FinderMeta;
    options?: Parameters<Locator['hover']>[0];
  };
};

export type BlurAction = {
  action: 'blur';
  payload: {
    on: FinderMeta;
    options?: Parameters<Locator['blur']>[0];
  };
};

export type PressSequentiallyAction = {
  action: 'pressSequentially';
  payload: {
    on: FinderMeta;
    text: string;
    options?: Parameters<Locator['pressSequentially']>[1];
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
    options?: Parameters<Locator['fill']>[1];
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
    options?: ScreenshotOptions;
  };
};

export type ScreenshotOptions = {
  mask?: FinderMeta[];
  maskColor?: string;
};

export type UserScreenshotOptions = {
  /**
   * An array of selectors specifying regions to mask in the screenshot.
   * Useful for hiding sensitive information.
   */
  mask?: Finder[];

  /**
   * The color to use for the mask overlays. Accepts any valid CSS color format.
   * Defaults to a pink color if not specified.
   */
  maskColor?: string;
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
  | DragAction
  | BlurAction
  | PressSequentiallyAction;
