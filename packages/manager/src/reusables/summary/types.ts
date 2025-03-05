import { Device, StoryID } from '@storyshots/core';
import { AcceptableRecords, AcceptableScreenshot } from '../runner/types';

export type ErrorSummary = {
  id: StoryID;
  device: Device;
  message: string;
};

export type ChangeSummary = {
  id: StoryID;
  device: Device;
  records?: AcceptableRecords;
  screenshots: AcceptableScreenshot[];
};

export type Summary = {
  pass: number;
  total: number;
  running: number;
  scheduled: number;
  errors: ErrorSummary[];
  changes: ChangeSummary[];
};
