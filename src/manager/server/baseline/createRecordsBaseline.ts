import path from 'path';

import { JournalRecord } from '../../../reusables/journal';
import { StoryID } from '../../../reusables/story';
import { not } from '../../../reusables/utils';
import { ServerConfig } from '../reusables/types';
import { exists, mkdir, mkfile, read } from './utils';
import { TreeOP } from '../../../reusables/tree';

export async function createRecordsBaseline(config: ServerConfig) {
  if (not(await exists(config.recordsPath))) {
    await mkdir(config.recordsPath);
  }

  return {
    getExpectedRecords: async (
      id: StoryID,
    ): Promise<JournalRecord[] | undefined> => {
      const records = await getRecordsMapByStoryId(id);

      return records[id];
    },
    acceptRecords: async (id: StoryID, actual: JournalRecord[]) => {
      debugger;
      const records = await getRecordsMapByStoryId(id);

      return updateRecordsMapByStoryId(id, { ...records, [id]: actual });
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

function getRecordsMapFileNameById(id: StoryID): string {
  const parents = TreeOP.parseInterNodeIDsChain(id);

  const last = parents[parents.length - 1];

  return `${last ?? id}.json`;
}

type RecordsMap = Record<StoryID, JournalRecord[]>;
