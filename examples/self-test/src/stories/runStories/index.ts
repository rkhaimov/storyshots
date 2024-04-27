import { describe } from '../../../storyshots/preview/config';
import { runAggregatedStories } from './runAggregatedStories';
import { runRecordsStories } from './runRecordsStories';
import { runScreenshotsStories } from './runScreenshotsStories';

export const runStories = describe('Run', [
  runRecordsStories,
  runScreenshotsStories,
  runAggregatedStories,
]);
