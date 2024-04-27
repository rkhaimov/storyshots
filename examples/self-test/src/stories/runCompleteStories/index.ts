import { describe } from '../../../storyshots/preview/config';
import { runCompleteRecordsStories } from './runCompleteRecordsStories';
import { runCompleteScreenshotsStories } from './runCompleteScreenshotStories';

export const runCompleteStories = describe('RunComplete', [
  runCompleteRecordsStories,
  runCompleteScreenshotsStories,
]);
