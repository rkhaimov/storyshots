import {
  createActor,
  Device,
  isNil,
  JournalRecord,
  PreviewState,
  PureStory,
  StoryID,
  TestConfig,
} from '@storyshots/core';
import {
  ActionsAndConfig,
  Screenshot,
  ScreenshotPath,
  WithPossibleError,
} from '../../../reusables/types';
import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  ScreenshotsComparisonResult,
} from './types';
import { driver } from '../../externals/driver';

export type ActualResult = {
  screenshots: ScreenshotsComparisonResult[];
  records: RecordsComparisonResult;
};

export async function createActualResult(
  story: PureStory,
  config: TestConfig,
  preview: PreviewState,
  attempt = 0,
): Promise<WithPossibleError<ActualResult>> {
  const result = await _createActualResult(story, config);

  if (attempt === preview.retries) {
    return result;
  }

  if (result.type === 'error') {
    return createActualResult(story, config, preview, attempt + 1);
  }

  if (result.data.screenshots.some((it) => it.result.type === 'fail')) {
    return createActualResult(story, config, preview, attempt + 1);
  }

  return result;
}

async function _createActualResult(
  story: PureStory,
  config: TestConfig,
): Promise<WithPossibleError<ActualResult>> {
  const actions = story.payload
    .act(createActor(), { ...config, screenshotting: true })
    .toMeta();

  const actual = await driver.actOnServerSide(story.id, {
    actions,
    config,
  });

  if (actual.type === 'error') {
    return actual;
  }

  return {
    type: 'success',
    data: {
      screenshots: await createScreenshotsComparisonResults(
        story.id,
        {
          actions,
          config,
        },
        actual.data.screenshots,
      ),
      records: await createRecordsComparisonResult(
        story.id,
        actual.data.records,
        config.device,
      ),
    },
  };
}

async function createScreenshotsComparisonResults(
  id: StoryID,
  payload: ActionsAndConfig,
  actual: Screenshot[],
): Promise<ScreenshotsComparisonResult[]> {
  const expected = await driver.getExpectedScreenshots(id, payload);

  const comparing = actual.map(async (actualScreenshot) => {
    const matchedOther = expected.find(
      (expectedOther) => expectedOther.name === actualScreenshot.name,
    );

    return {
      name: actualScreenshot.name,
      result: await createScreenshotComparisonResult(
        actualScreenshot.path,
        matchedOther?.path,
      ),
    };
  });

  return Promise.all(comparing);
}

async function createScreenshotComparisonResult(
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
  id: StoryID,
  actual: JournalRecord[],
  device: Device,
): Promise<RecordsComparisonResult> {
  const expected = await driver.getExpectedRecords(id, device);

  if (expected === null) {
    return { type: 'fresh', actual };
  }

  const equal = JSON.stringify(actual) === JSON.stringify(expected);

  if (equal) {
    return { type: 'pass', actual };
  }

  return { type: 'fail', actual, expected };
}
