import { Channel } from '@storyshots/core';
import { Frame } from 'playwright';

export function createActualRecords(preview: Frame) {
  return preview.evaluate(() => (window as never as Channel).records());
}
