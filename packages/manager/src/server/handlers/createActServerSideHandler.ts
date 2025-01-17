import {
  Channel,
  Device,
  isNil,
  JournalRecord,
  ScreenshotAction,
  StoryID,
  TestConfig,
  TreeOP,
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
          config,
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
  await page.waitForFunction(() => window.document.fonts.ready);

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

async function withRetries(
  retries: number,
  fn: () => Promise<WithPossibleError<TestResultDetails>>,
): Promise<WithPossibleError<TestResultDetails>> {
  const result = await fn();

  if (retries === 0 || result.type === 'error') {
    return result;
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
  config: ManagerConfig,
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
      config,
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
  config: ManagerConfig,
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
        id,
        payload,
        actualScreenshot.path,
        matchedOther?.path,
        config,
      ),
    };
  });

  return Promise.all(comparing);
}

async function createScreenshotComparisonResult(
  baseline: Baseline,
  id: StoryID,
  meta: ActionsAndConfig,
  actual: ScreenshotPath,
  expected: ScreenshotPath | undefined,
  config: ManagerConfig,
): Promise<ScreenshotComparisonResult> {
  if (isNil(expected)) {
    return { type: 'fresh', actual: actual };
  }

  const { equal } = await config.compare(
    await baseline.readScreenshot(actual),
    await baseline.readScreenshot(expected),
    { id, meta },
  );

  if (equal) {
    return { type: 'pass', actual: actual };
  }

  return { type: 'fail', actual: actual, expected: expected };
}
