import { JournalRecord } from '../../../../reusables/journal';
import { PureStory, StoryID } from '../../../../reusables/story';
import { isNil } from '../../../../reusables/utils';
import {
  ActionsOnDevice,
  ActualScreenshots,
  IWebDriver,
  ScreenshotPath,
} from '../../../reusables/types';
import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  ScreenshotsComparisonResults,
  ScreenshotsComparisonResultsByMode,
  TestResult,
} from './types';

export async function createRunTestResult(
  driver: IWebDriver,
  story: PureStory,
  includeAdditional: boolean,
): Promise<TestResult> {
  const actualResults = await driver.actOnServerSide(story.id, {
    actions: story.payload.actions,
    device: story.payload.devices.primary,
  });

  if (actualResults.type === 'error') {
    return {
      running: false,
      type: 'error',
      message: actualResults.message,
    };
  }

  const additionalResults: ScreenshotsComparisonResultsByMode[] = [];

  if (includeAdditional) {
    for (const device of story.payload.devices.additional) {
      const result = await driver.actOnServerSide(story.id, {
        actions: story.payload.actions,
        device,
      });

      if (result.type === 'error') {
        return {
          running: false,
          type: 'error',
          message: result.message,
        };
      }

      additionalResults.push({
        device,
        results: await createScreenshotsComparisonResults(
          driver,
          story.id,
          { actions: story.payload.actions, device },
          result.data.screenshots,
        ),
      });
    }
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
        device: story.payload.devices.primary,
        results: await createScreenshotsComparisonResults(
          driver,
          story.id,
          {
            actions: story.payload.actions,
            device: story.payload.devices.primary,
          },
          actualResults.data.screenshots,
        ),
      },
      additional: additionalResults,
    },
  };
}

async function createScreenshotsComparisonResults(
  driver: IWebDriver,
  id: StoryID,
  payload: ActionsOnDevice,
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
  driver: IWebDriver,
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
  driver: IWebDriver,
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