import path from 'path';
import { JournalRecord, StoryID } from '../../reusables/types';
import { not } from '../../reusables/utils';
import { ServerConfig } from '../reusables/types';
import { exists, mkdir, mkfile, read } from './utils';

export async function createRecordsBaseline(config: ServerConfig) {
  if (not(await exists(config.recordsPath))) {
    await mkdir(config.recordsPath);
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
    const fullPath = path.join(config.recordsPath, name);

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
    const file = path.join(config.recordsPath, name);

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
