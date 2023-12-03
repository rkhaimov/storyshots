import path from 'path';
import { not } from '../../reusables/utils';
import { exists, mkdir, mkfile, read } from './utils';
import { JournalRecord, StoryID } from '../../reusables/types';

export async function createRecordsBaseline() {
  const expectedResultsDir = path.join(process.cwd(), 'records');

  if (not(await exists(expectedResultsDir))) {
    await mkdir(expectedResultsDir);
  }

  return {
    getExpectedRecords: async (
      id: StoryID,
    ): Promise<JournalRecord[] | undefined> => {
      const key = getRecordsKeyByStoryId(id);
      const recordsMap = await getRecordsMapByStoryId(id);

      return recordsMap[key];
    },
    acceptRecords: async (id: StoryID, actual: JournalRecord[]) => {
      const key = getRecordsKeyByStoryId(id);
      const recordsMap = await getRecordsMapByStoryId(id);

      return updateRecordsMapByStoryId(id, { ...recordsMap, [key]: actual });
    },
  };

  async function getRecordsMapByStoryId(id: StoryID): Promise<RecordsMap> {
    const name = getRecordsMapFileNameById(id);
    const fullPath = path.join(expectedResultsDir, name);

    if (not(await exists(fullPath))) {
      return {};
    }

    return JSON.parse((await read(fullPath)).toString());
  }

  async function updateRecordsMapByStoryId(
    id: StoryID,
    records: RecordsMap,
  ): Promise<void> {
    const name = getRecordsMapFileNameById(id);
    const file = path.join(expectedResultsDir, name);

    return mkfile(file, JSON.stringify(records, null, 2));
  }
}

type RecordsMap = Record<string, JournalRecord[]>;

function getRecordsKeyByStoryId(id: StoryID) {
  const parts = id.split('_');

  return parts[parts.length - 1];
}

// TODO: Make structure of StoryID implicit
function getRecordsMapFileNameById(id: StoryID) {
  const parts = id.split('_');

  return `${parts.length === 1 ? parts[0] : parts.slice(0, -1).join('_')}.json`;
}
