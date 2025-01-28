import { getInjectedScript } from './getInjectedScript';
import { getConsoleApiUtils } from './getConsoleApiUtils';

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
