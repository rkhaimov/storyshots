import { Frame } from 'puppeteer';
import { NonScreenshotAction } from '../../reusables/actions';
import { WithPossibleError } from '../../reusables/types';
import { WithPossibleErrorOP } from '../handlers/reusables/with-possible-error';
import { select } from './select';

export async function act(
  preview: Frame,
  action: NonScreenshotAction,
): Promise<WithPossibleError<void>> {
  const result = await select(preview, action.payload.on);

  if (result.type === 'error') {
    return result;
  }

  const element = result.data;

  switch (action.action) {
    case 'click':
      return WithPossibleErrorOP.fromThrowable(() => element.click());
    case 'fill':
      return WithPossibleErrorOP.fromThrowable(() =>
        element.type(action.payload.text),
      );
  }
}
