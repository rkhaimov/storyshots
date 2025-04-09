import { isNil } from '@lib';
import {
  RecordsComparisonResult,
  TestRunResult,
} from '../../../../reusables/runner/types';
import { ActualResults } from '../getActualResults';
import { ExpectedPayload } from '../getActualResults/types';

export async function getTestResults(
  payload: FinalPayload,
): Promise<TestRunResult> {
  return {
    records: await createRecordsComparisonResult(payload),
    screenshots: payload.actual.screenshots,
  };
}

async function createRecordsComparisonResult({
  expected: { records: expected },
  actual: { records: actual },
}: FinalPayload): Promise<RecordsComparisonResult> {
  if (isNil(expected)) {
    return { type: 'fresh', actual };
  }

  const equal = JSON.stringify(actual) === JSON.stringify(expected);

  if (equal) {
    return { type: 'pass', actual };
  }

  return { type: 'fail', actual, expected };
}

type FinalPayload = ExpectedPayload & {
  actual: ActualResults;
};
