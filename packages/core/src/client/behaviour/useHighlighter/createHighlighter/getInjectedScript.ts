import { Brand } from '@core';
import { source as injectedScriptSource } from '../generated/injectedScriptSource';
import { execScriptFromSource } from './execScriptFromSource';

export async function getInjectedScript(frame: Window) {
  const exports = await execScriptFromSource(frame, injectedScriptSource);

  const injectedScriptClass = (
    exports as { InjectedScript(): InjectedScriptConstructor }
  ).InjectedScript();

  return new injectedScriptClass(
    frame,
    false,
    'javascript',
    'data-testid',
    0,
    'chromium',
    [],
  );
}

export interface InjectedScript {
  parseSelector(internal: InternalSelector): ParsedSelector;

  highlight(parsed: ParsedSelector): void;

  hideHighlight(): void;
}

interface InjectedScriptConstructor {
  new (
    window: Window,
    isUnderTest: false,
    sdk: 'javascript',
    testId: 'data-testid',
    rafCount: 0,
    browser: 'chromium',
    engines: [],
  ): InjectedScript;
}

export type InternalSelector = Brand<unknown, 'InternalSelector'>;

type ParsedSelector = Brand<unknown, 'ParsedSelector'>;
