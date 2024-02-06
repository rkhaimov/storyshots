import { StoryID } from '../../../reusables/types';
import { isNil } from '../../../reusables/utils';
import { TestResults } from '../../Manager/behaviour/useTestResults/types';
import { SerializableStoryshotsNode } from '../channel';
import { StatusType } from './types';

export function getStoryStatus(
  storyId: StoryID,
  results: TestResults,
): StatusType {
  const testResult = results.get(storyId);

  if (
    isNil(testResult) ||
    testResult.running ||
    (testResult && testResult.type !== 'success')
  ) {
    return 'default';
  }

  const typeFinal = testResult.screenshots.primary.results.final.type;
  const typeOthers = testResult.screenshots.primary.results.others;
  const typeRecords = testResult.records.type;

  const types = [
    typeRecords,
    typeFinal,
    ...typeOthers.map(({ result }) => result.type),
  ];

  return getCommonStatus(types);
}

export function getGroupStatus(
  nodes: SerializableStoryshotsNode[],
  results: TestResults,
): StatusType {
  const allStoriesStatuses = nodes.map((it) => {
    if (it.type === 'group') {
      return getGroupStatus(it.children, results);
    }

    return getStoryStatus(it.id, results);
  });

  return getCommonStatus(allStoriesStatuses);
}

function getCommonStatus(types: StatusType[]): StatusType {
  if (types.includes('fail')) {
    return 'fail';
  }

  if (types.includes('fresh')) {
    return 'fresh';
  }

  if (types.includes('pass')) {
    return 'pass';
  }

  return 'default';
}
