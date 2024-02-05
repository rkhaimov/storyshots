import {
  ActionsAndMode,
  ActualScreenshots,
  JournalRecord,
  ScreenshotPath,
  StoryID,
} from '../../../../reusables/types';
import { isNil } from '../../../../reusables/utils';
import { IExternals } from '../../../externals/types';
import { SerializableStoryNode } from '../../../reusables/channel';
import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  ScreenshotsComparisonResults,
  TestResult,
} from './types';

export async function createRunTestResult(
  driver: IExternals['driver'],
  story: SerializableStoryNode,
): Promise<TestResult> {
  const payload = { actions: story.actions, mode: story.modes.primary };
  const actualResults = await driver.actOnServerSide(story.id, payload);

  if (actualResults.type === 'error') {
    return {
      running: false,
      type: 'error',
      message: actualResults.message,
    };
  }

  return {
    running: false,
    type: 'success',
    records: await createRecordsComparisonResult(
      driver,
      story.id,
      actualResults.data.records,
    ),
    screenshots: {
      primary: {
        mode: story.modes.primary,
        results: await createScreenshotsComparisonResults(
          driver,
          story.id,
          payload,
          actualResults.data.screenshots,
        ),
      },
      additional: [],
    },
  };
}

async function createScreenshotsComparisonResults(
  driver: IExternals['driver'],
  id: StoryID,
  payload: ActionsAndMode,
  actual: ActualScreenshots,
): Promise<ScreenshotsComparisonResults> {
  const expected = await driver.getExpectedScreenshots(id, payload);

  const others = actual.others.map(async (actualOther) => {
    const matchedOther = expected.others.find(
      (expectedOther) => expectedOther.name === actualOther.name,
    );

    return {
      name: actualOther.name,
      result: await createScreenshotComparisonResult(
        driver,
        actualOther.path,
        matchedOther?.path,
      ),
    };
  });

  const final = await createScreenshotComparisonResult(
    driver,
    actual.final,
    expected.final,
  );

  return {
    final,
    others: await Promise.all(others),
  };
}

async function createScreenshotComparisonResult(
  driver: IExternals['driver'],
  left: ScreenshotPath,
  right: ScreenshotPath | undefined,
): Promise<ScreenshotComparisonResult> {
  if (isNil(right)) {
    return { type: 'fresh', actual: left };
  }

  if (await driver.areScreenshotsEqual({ left, right })) {
    return { type: 'pass', actual: left };
  }

  return { type: 'fail', actual: left, expected: right };
}

async function createRecordsComparisonResult(
  driver: IExternals['driver'],
  id: StoryID,
  actual: JournalRecord[],
): Promise<RecordsComparisonResult> {
  const expected = await driver.getExpectedRecords(id);

  if (expected === null) {
    return { type: 'fresh', actual };
  }

  const equal = JSON.stringify(actual) === JSON.stringify(expected);

  if (equal) {
    return { type: 'pass', actual };
  }

  return { type: 'fail', actual, expected };
}
