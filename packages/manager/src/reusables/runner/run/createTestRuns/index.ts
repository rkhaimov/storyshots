import { RunConfig } from '../types';
import { cancellable } from './cancellable';
import { retryable } from './retryable';
import { createTests } from './createTests';
import { sync } from './sync';

export function createTestRuns(config: RunConfig) {
  return cancellable(config, retryable(createTests(config)), sync(config));
}
