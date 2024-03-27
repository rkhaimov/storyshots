import {
  ActionsOnDevice,
  ActualScreenshots,
  IWebDriver,
  ScreenshotPath,
  WithPossibleError,
} from '../../../reusables/types';
import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  ScreenshotsComparisonResults,
  TestConfig,
} from './types';
import { isNil, JournalRecord, PureStory, StoryID } from '@storyshots/core';

export type ActualResult = {
  screenshots: ScreenshotsComparisonResults;
  records: RecordsComparisonResult;
  config: TestConfig;
};

export async function createResult(
  driver: IWebDriver,
  story: PureStory,
  config: TestConfig,
): Promise<WithPossibleError<ActualResult>> {
  const actualResults = await driver.actOnServerSide(story.id, {
    actions: story.payload.actions,
    device: config.device,
    presets: config.presets,
  });

  if (actualResults.type === 'error') {
    return actualResults;
  }

  return {
    type: 'success',
    data: {
      screenshots: await createScreenshotsComparisonResults(
        driver,
        story.id,
        {
          actions: story.payload.actions,
          device: config.device,
          presets: config.presets,
        },
        actualResults.data.screenshots,
      ),
      records: await createRecordsComparisonResult(
        driver,
        story.id,
        actualResults.data.records,
      ),
      config,
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

export async function createRecordsComparisonResult(
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
