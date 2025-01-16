import { TestResult } from './types';

export function isOnRun(
  result: TestResult,
): result is Extract<TestResult, { type: 'scheduled' }> {
  return (
    result.type === 'scheduled' || (result.type === 'success' && result.running)
  );
}
