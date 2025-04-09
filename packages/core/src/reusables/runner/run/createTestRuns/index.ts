import { RunConfig } from '../types';
import { cancellable } from './cancellable';
import { createTests } from './createTests';
import { retryable } from './retryable';
import { sync } from './sync';

export function createTestRuns(config: RunConfig) {
  return cancellable(config, retryable(createTests(config)), sync(config));
}
