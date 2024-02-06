import { Frame } from 'puppeteer';
import { NonScreenshotAction } from '../../reusables/actions';
import { WithPossibleError } from '../../reusables/types';
import { select } from './select';

export async function act(
  preview: Frame,
  action: NonScreenshotAction,
): Promise<WithPossibleError<void>> {
  const elements = await select(preview, action.payload.on);

  if (elements.length === 0) {
    return {
      type: 'error',
      message: 'Found zero elements matching given criteria.',
    };
  }

  if (elements.length > 1) {
    console.warn(`Found more than one element (${elements.length}) matching given criteria!`);
  }

  const [element] = elements;

  await element.click();

  return {
    type: 'success',
    data: undefined,
  };
}
