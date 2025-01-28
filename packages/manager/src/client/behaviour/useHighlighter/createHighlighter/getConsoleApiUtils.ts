import { InjectedScript, InternalSelector } from './getInjectedScript';
import { source as consoleApiSource } from '../generated/consoleApiSource';
import { execScriptFromSource } from './execScriptFromSource';
import { assertNotEmpty } from '@storyshots/core';

export async function getConsoleApiUtils(
  frame: Window,
  injectedScript: InjectedScript,
) {
  const exports = await execScriptFromSource(frame, consoleApiSource);

  const consoleApiClass = (
    exports as { default(): ConsoleApiConstructor }
  ).default();

  new consoleApiClass(injectedScript);

  assertNotEmpty(frame.playwright, 'Failed to initialize highlighter');

  return frame.playwright;
}

interface ConsoleApiConstructor {
  new (injected: InjectedScript): unknown;
}

type PlaywrightUtils = {
  selector(element: Element): InternalSelector;
};

declare global {
  interface Window {
    playwright?: PlaywrightUtils;
  }
}
