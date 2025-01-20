import { Page } from 'playwright';
import { handlePossibleErrors } from '../reusables/handlePossibleErrors';
import { getActualResults } from './getActualResults';
import { getExpectedResults } from './getExpectedResults';
import { getTestResults } from './getTestResults';
import { BasePayload } from './types';

export const createTestResults = (payload: BasePayload, page: Page) =>
  handlePossibleErrors(async () => {
    const expected = await getExpectedResults(payload);
    const actual = await getActualResults({ ...payload, expected }, page);

    return getTestResults({ ...payload, expected, actual });
  });
