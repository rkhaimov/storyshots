import { StoryID } from '@storyshots/core';
import { AcceptableRecord, AcceptableScreenshot, TestResultDetails } from './types';

export function getAcceptableRecords(
  id: StoryID,
  details: TestResultDetails[],
): AcceptableRecord[] {
  return details
    .filter((it) => it.records.type !== 'pass')
    .map((it) => ({
      id,
      details: it,
      result: it.records as never,
    }));
}

export function getAcceptableScreenshots(
  details: TestResultDetails[],
): AcceptableScreenshot[] {
  return details.flatMap((detail) =>
    detail.screenshots
      .map((it) => it.result)
      .filter((it): it is AcceptableScreenshot['result'] => it.type !== 'pass')
      .map((it) => ({ details: detail, result: it })),
  );
}
