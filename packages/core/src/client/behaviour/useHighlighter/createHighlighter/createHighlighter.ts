import { getConsoleApiUtils } from './getConsoleApiUtils';
import { getInjectedScript } from './getInjectedScript';

export async function createHighlighter(frame: Window) {
  const injectedScript = await getInjectedScript(frame);
  const utils = await getConsoleApiUtils(frame, injectedScript);

  return {
    highlight: (element: Element) =>
      injectedScript.highlight(
        injectedScript.parseSelector(utils.selector(element)),
      ),
    hide: () => injectedScript.hideHighlight(),
  };
}
