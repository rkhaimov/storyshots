import { isNil } from '../../../../reusables/utils';
import { SerializableStoryNode } from '../../../reusables/channel';
import { SelectionState } from '../../behaviour/useSelection';
import { TestResults } from '../../behaviour/useTestResults/types';
import { EntryStatus } from './EntryTitle';

export function getStoryEntryStatus(
  results: TestResults,
  selection: SelectionState,
  story: SerializableStoryNode,
): EntryStatus {
  if (
    selection.type === 'story' &&
    selection.story.id === story.id &&
    selection.playing === false &&
    selection.result.type === 'error'
  ) {
    return 'error';
  }

  const comparison = results.get(story.id);

  if (isNil(comparison) || comparison.running) {
    return null;
  }

  return null;
}
