import { StoryID } from '@storyshots/core';
import { RunnableStoriesSuit, WithPossibleError } from '../types';
import { TestResult, TestResultDetails } from './types';
import { pool } from './pool';
import { driver } from './driver';

export type RunConfig = {
  stories: RunnableStoriesSuit[];
  abort: AbortSignal;
  size: number;
  onResult(id: StoryID, result: TestResult): void;
};

export function run({ abort, onResult, stories, size }: RunConfig) {
  markAllAsScheduled(stories, onResult);

  const cases = createAllRunCases(stories);
  const onActed = createResultsSyncer(onResult);
  const acting = createActEffects(cases, onResult, abort, onActed);

  return pool(acting, { size: size });
}

function markAllAsScheduled(
  stories: RunnableStoriesSuit[],
  onResult: (id: StoryID, result: TestResult) => void,
) {
  for (const story of stories) {
    onResult(story.id, { type: 'scheduled' });
  }
}

function createAllRunCases(stories: RunnableStoriesSuit[]) {
  return stories.flatMap((story) =>
    story.cases.map((config) => ({ meta: story, config })),
  );
}

function createResultsSyncer(
  onResult: (id: StoryID, result: TestResult) => void,
): OnActed {
  const ran = new Map<StoryID, TestResultDetails[]>();

  return (story, result) => {
    if (result.type === 'error') {
      onResult(story.meta.id, {
        type: 'error',
        message: result.message,
      });

      return;
    }

    const details = [...(ran.get(story.meta.id) ?? []), result.data];

    onResult(story.meta.id, {
      type: 'success',
      running: details.length < story.meta.cases.length,
      details,
    });

    ran.set(story.meta.id, details);
  };
}

function createActEffects(
  cases: ReturnType<typeof createAllRunCases>,
  onResult: (id: StoryID, result: TestResult) => void,
  abort: AbortSignal,
  onActed: OnActed,
) {
  return cases.map((story) => async () => {
    abort.throwIfAborted();

    onResult(story.meta.id, { type: 'success', running: true, details: [] });

    const result = await withRetries(
      () =>
        driver.actOnServerSide(story.meta.id, {
          config: { device: story.config.device },
          actions: story.config.actions,
        }),
      story.config.retries,
    );

    abort.throwIfAborted();

    onActed(story, result);
  });
}

async function withRetries(
  act: () => Promise<WithPossibleError<TestResultDetails>>,
  retries: number,
) {
  const result = await act();

  if (retries === 0 || result.type === 'error') {
    return result;
  }

  if (
    result.data.screenshots.some((it) => it.result.type === 'fail') ||
    result.data.records.type === 'fail'
  ) {
    return withRetries(act, retries - 1);
  }

  return result;
}

type OnActed = (
  story: ReturnType<typeof createAllRunCases>[number],
  result: WithPossibleError<TestResultDetails>,
) => void;
