import { RunnableStoriesSuit, WithPossibleError } from '../types';
import { driver } from './driver';
import { TestResult } from './types';

export async function createTestResult(
  story: RunnableStoriesSuit,
): Promise<TestResult> {
  const runs = await Promise.all(
    story.cases.map(({ device, actions }) =>
      driver.actOnServerSide(story.id, { config: { device }, actions }),
    ),
  );

  const results = traverseError(runs);

  if (results.type === 'error') {
    return {
      running: false,
      type: 'error',
      message: results.message,
    };
  }

  return {
    running: false,
    type: 'success',
    details: results.data,
  };
}

function traverseError<T>(
  input: Array<WithPossibleError<T>>,
): WithPossibleError<Array<T>> {
  if (input.length === 0) {
    return { type: 'success', data: [] };
  }

  const [head, ...tail] = input;

  if (head.type === 'error') {
    return head;
  }

  const others = traverseError(tail);

  if (others.type === 'error') {
    return others;
  }

  return {
    type: 'success',
    data: [head.data, ...others.data],
  };
}
