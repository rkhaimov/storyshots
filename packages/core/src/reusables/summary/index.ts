import { Device, StoryID } from '@core';
import { isNil } from '@lib';
import { DeviceToTestRunState, TestRunState } from '../runner/types';
import { ChangeSummary, ErrorSummary, Summary } from './types';

export function createSummary(
  results: Map<StoryID, DeviceToTestRunState | undefined>,
): Summary {
  return Array.from(results.entries()).reduce(
    (summary, [id, state]) =>
      join(summary, createSummaryFromDeviceToState(id, state)),
    createEmptySummary(),
  );
}

function createSummaryFromDeviceToState(
  id: StoryID,
  state: DeviceToTestRunState | undefined,
): Summary {
  if (isNil(state)) {
    return createEmptySummary();
  }

  const states = Array.from(state.entries());

  const total = states.length;
  const running = getRunning(states);
  const scheduled = getScheduled(states);
  const errors = getErrors(states);
  const changes = getChanges(states);
  const pass = total - (running + scheduled + errors.length + changes.length);

  return {
    total,
    pass,
    running,
    scheduled,
    errors,
    changes,
  };

  function getChanges(states: [Device, TestRunState][]) {
    return states.reduce((changes, [device, state]): ChangeSummary[] => {
      if (state.type !== 'done' || state.details.type !== 'success') {
        return changes;
      }

      const records =
        state.details.data.records.type === 'pass'
          ? undefined
          : state.details.data.records;

      const screenshots = state.details.data.screenshots.filter(
        (screenshot) => screenshot.type !== 'pass',
      );

      if (isNil(records) && screenshots.length === 0) {
        return changes;
      }

      return [
        ...changes,
        {
          id,
          device,
          records,
          screenshots,
        },
      ];
    }, [] as ChangeSummary[]);
  }

  function getErrors(states: [Device, TestRunState][]) {
    return states.reduce((errors, [device, state]) => {
      if (state.type !== 'done' || state.details.type !== 'error') {
        return errors;
      }

      return [...errors, { id, device, message: state.details.message }];
    }, [] as ErrorSummary[]);
  }

  function getRunning(states: [Device, TestRunState][]) {
    return states.filter(([, state]) => state.type === 'running').length;
  }

  function getScheduled(states: [Device, TestRunState][]) {
    return states.filter(([, state]) => state.type === 'scheduled').length;
  }
}

function join(left: Summary, right: Summary): Summary {
  return {
    total: left.total + right.total,
    pass: left.pass + right.pass,
    running: left.running + right.running,
    scheduled: left.scheduled + right.scheduled,
    changes: [...left.changes, ...right.changes],
    errors: [...left.errors, ...right.errors],
  };
}

function createEmptySummary(): Summary {
  return {
    total: 0,
    pass: 0,
    running: 0,
    scheduled: 0,
    changes: [],
    errors: [],
  };
}
