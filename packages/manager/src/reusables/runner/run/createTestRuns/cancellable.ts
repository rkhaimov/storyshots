import { RunConfig } from '../types';
import { Test } from './createTests';

export function cancellable(
  config: RunConfig,
  tests: Test[],
  createEvents: CancellableEventsFactory,
) {
  const events = createEvents(tests);

  return tests.map((test) => async () => {
    ensureIsNotAborted(config, events, test);

    events.onStart(test);

    const result = await test.run();

    events.onFinish(test, result);
  });
}

export type CancellableEventsFactory = (tests: Test[]) => CancellableEvents;

type Result = Awaited<ReturnType<Test['run']>>;

type CancellableEvents = {
  onStart(test: Test): void;
  onFinish(test: Test, result: Result): void;
  onCancel(test: Test): void;
};

function ensureIsNotAborted(
  config: RunConfig,
  events: CancellableEvents,
  test: Test,
) {
  if (config.abort.aborted) {
    events.onCancel(test);

    config.abort.throwIfAborted();
  }
}
