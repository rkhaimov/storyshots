import {
  Channel,
  Device,
  isNil,
  JournalRecord,
  ScreenshotAction,
  StoryID,
  TestConfig,
  TreeOP,
  wait,
} from '@storyshots/core';
import { Application } from 'express-serve-static-core';
import { Frame, Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  ScreenshotsComparisonResult,
  TestResultDetails,
} from '../../reusables/runner/types';
import {
  ActionsAndConfig,
  ActualServerSideResult,
  Screenshot,
  ScreenshotPath,
  WithPossibleError,
} from '../../reusables/types';
import { createStoryURL } from '../paths';
import { act } from '../reusables/act';
import { Baseline } from '../reusables/baseline';
import { toPreviewFrame } from '../reusables/toPreviewFrame';
import { ManagerConfig } from '../reusables/types';
import { areScreenshotsEqual } from './createScreenshotEqualHandler';
import { findExpectedScreenshots } from './findExpectedScreenshots';
import { handlePossibleErrors } from './reusables/handlePossibleErrors';

type ActPayload = {
  id: StoryID;
  payload: ActionsAndConfig;
};

export async function createActServerSideHandler(
  app: Application,
  baseline: Baseline,
  config: ManagerConfig,
) {
  const cluster: Cluster<
    ActPayload,
    WithPossibleError<TestResultDetails>
  > = await Cluster.launch({
    timeout: Math.pow(2, 31) - 1,
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: config.optimization.agentsCount,
    puppeteerOptions: {
      headless: true,
    },
  });

  await cluster.task(({ page, data }) =>
    withRetries(config.optimization.retries, () =>
      handlePossibleErrors(async () =>
        createTestResultDetails(
          baseline,
          data.id,
          data.payload,
          await createServerResultByDevice(
            baseline,
            page,
            data.id,
            data.payload,
            config,
          ),
        ),
      ),
    ),
  );

  app.post('/api/server/act/:id', async (request, response) => {
    const id = TreeOP.ensureIsLeafID(request.params.id);
    const payload: ActionsAndConfig = request.body;

    response.json(await cluster.execute({ id, payload }));
  });

  return () => cluster.close();
}

async function createServerResultByDevice(
  baseline: Baseline,
  page: Page,
  id: StoryID,
  payload: ActionsAndConfig,
  config: ManagerConfig,
) {
  await configurePageByMode(payload.config.device, page);

  await page.goto(createStoryURL(id, payload.config).href, {
    waitUntil: 'networkidle0',
  });

  const preview = await toPreviewFrame(page);

  await preview.addStyleTag({
    content: `
    *,
    *::after,
    *::before {
      transition-delay: 0s !important;
      transition-duration: 0s !important;
      animation-delay: 0s !important;
      animation-duration: 0s !important;
      animation-play-state: paused !important;
      caret-color: transparent !important;
    }
    `,
  });

  return interactWithPageAndMakeShots(
    baseline,
    page,
    preview,
    id,
    payload,
    config,
  );
}

async function configurePageByMode(device: Device, page: Page) {
  switch (device.type) {
    case 'size-only':
      return page.setViewport(device.config);
    case 'emulated':
      return page.emulate({
        viewport: device.config,
        userAgent: device.config.userAgent,
      });
  }
}

async function interactWithPageAndMakeShots(
  baseline: Baseline,
  page: Page,
  preview: Frame,
  id: StoryID,
  { actions, config }: ActionsAndConfig,
  server: ManagerConfig,
): Promise<ActualServerSideResult> {
  const screenshots: Screenshot[] = [];

  await act(
    preview,
    actions,
    async (action) =>
      void screenshots.push(
        await createScreenshot(baseline, page, id, action, config, server),
      ),
  );

  const records = await preview.evaluate(() =>
    (window as never as Channel).records(),
  );

  return {
    records,
    screenshots,
  };
}

async function createScreenshot(
  baseline: Baseline,
  page: Page,
  id: StoryID,
  action: ScreenshotAction,
  config: TestConfig,
  server: ManagerConfig,
): Promise<Screenshot> {
  await server.optimization.stabilize(page, id, action, config);

  const path = await baseline.createActualScreenshot(
    id,
    config,
    action.payload.name,
    await page.screenshot({ type: 'png' }),
  );

  return {
    name: action.payload.name,
    path,
  };
}

export type Stabilizer = (
  page: Page,
  id: StoryID,
  action: ScreenshotAction,
  config: TestConfig,
) => Promise<void>;

const none: Stabilizer = async () => {};

type ImageStabilizerConfig = {
  attempts: number;
  interval(attempt: number): number;
};

const byImage = (config: ImageStabilizerConfig): Stabilizer => {
  const stabilizer = async (
    story: StoryID,
    page: Page,
    last: Uint8Array,
    attempt = 0,
  ): Promise<void> => {
    if (attempt === config.attempts) {
      return;
    }

    await wait(config.interval(attempt));

    const curr = await page.screenshot({ type: 'png' });

    if (Buffer.from(last).equals(curr)) {
      return;
    }

    return stabilizer(story, page, curr, attempt + 1);
  };

  return async (page, id) =>
    stabilizer(id, page, await page.screenshot({ type: 'png' }));
};

export const STABILIZER = {
  none,
  byImage,
};

async function withRetries(
  retries: number,
  fn: () => Promise<WithPossibleError<TestResultDetails>>,
): Promise<WithPossibleError<TestResultDetails>> {
  const result = await fn();

  if (retries === 0) {
    return result;
  }

  if (result.type === 'error') {
    return withRetries(retries - 1, fn);
  }

  if (result.data.screenshots.some((it) => it.result.type === 'fail')) {
    return withRetries(retries - 1, fn);
  }

  if (result.data.records.type === 'fail') {
    return withRetries(retries - 1, fn);
  }

  return result;
}

async function createTestResultDetails(
  baseline: Baseline,
  id: StoryID,
  payload: ActionsAndConfig,
  actual: ActualServerSideResult,
): Promise<TestResultDetails> {
  return {
    device: payload.config.device,
    records: await createRecordsComparisonResult(
      baseline,
      id,
      actual.records,
      payload.config.device,
    ),
    screenshots: await createScreenshotsComparisonResults(
      baseline,
      id,
      payload,
      actual.screenshots,
    ),
  };
}

async function createRecordsComparisonResult(
  baseline: Baseline,
  id: StoryID,
  actual: JournalRecord[],
  device: Device,
): Promise<RecordsComparisonResult> {
  const expected = await baseline.getExpectedRecords(id, device);

  if (isNil(expected)) {
    return { type: 'fresh', actual };
  }

  const equal = JSON.stringify(actual) === JSON.stringify(expected);

  if (equal) {
    return { type: 'pass', actual };
  }

  return { type: 'fail', actual, expected };
}

async function createScreenshotsComparisonResults(
  baseline: Baseline,
  id: StoryID,
  payload: ActionsAndConfig,
  actual: Screenshot[],
): Promise<ScreenshotsComparisonResult[]> {
  const expected = await findExpectedScreenshots(baseline, id, payload);

  const comparing = actual.map(async (actualScreenshot) => {
    const matchedOther = expected.find(
      (expectedOther) => expectedOther.name === actualScreenshot.name,
    );

    return {
      name: actualScreenshot.name,
      result: await createScreenshotComparisonResult(
        baseline,
        actualScreenshot.path,
        matchedOther?.path,
      ),
    };
  });

  return Promise.all(comparing);
}

async function createScreenshotComparisonResult(
  baseline: Baseline,
  left: ScreenshotPath,
  right: ScreenshotPath | undefined,
): Promise<ScreenshotComparisonResult> {
  if (isNil(right)) {
    return { type: 'fresh', actual: left };
  }

  if (await areScreenshotsEqual(baseline, left, right)) {
    return { type: 'pass', actual: left };
  }

  return { type: 'fail', actual: left, expected: right };
}
