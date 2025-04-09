import { ChangeSummary, Summary } from '../../../reusables/summary/types';
import { EntryStatus } from './types';

export function getStatusFromSummary(summary: Summary): EntryStatus {
  if (summary.errors.length > 0) {
    return 'error';
  }

  if (summary.changes.length > 0) {
    return summary.changes.some(hasFailures) ? 'fail' : 'fresh';
  }

  if (summary.running > 0) {
    return 'running';
  }

  if (summary.scheduled > 0) {
    return 'scheduled';
  }

  if (summary.pass > 0) {
    return 'pass';
  }
}

function hasFailures(change: ChangeSummary): boolean {
  return (
    change.records?.type === 'fail' ||
    change.screenshots.some((screenshot) => screenshot.type === 'fail')
  );
}
