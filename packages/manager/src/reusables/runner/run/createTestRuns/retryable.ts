import { Test } from './createTests';

export function retryable(tests: Test[]): Test[] {
  return tests.map((test) => ({
    ...test,
    run: () => withRetries(test.run, test.case.retries),
  }));
}

async function withRetries(run: Test['run'], retries: number) {
  const result = await run();

  if (retries === 0 || result.type === 'error') {
    return result;
  }

  if (
    result.data.screenshots.some((it) => it.type === 'fail') ||
    result.data.records.type === 'fail'
  ) {
    return withRetries(run, retries - 1);
  }

  return result;
}
