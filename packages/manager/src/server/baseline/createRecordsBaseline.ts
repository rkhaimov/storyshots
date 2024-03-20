import path from 'path';

import { ServerConfig } from '../reusables/types';
import { exists, mkdir, mkfile, read } from './utils';
import { JournalRecord, not, StoryID, TreeOP } from '@storyshots/core';

export async function createRecordsBaseline(config: ServerConfig) {
  if (not(await exists(config.paths.records))) {
    await mkdir(config.paths.records);
  }

  return {
    getExpectedRecords: async (
      id: StoryID,
    ): Promise<JournalRecord[] | undefined> => {
      const records = await getRecordsMapByStoryId(id);

      return records[id];
    },
    acceptRecords: async (id: StoryID, actual: JournalRecord[]) => {
      const records = await getRecordsMapByStoryId(id);

      return updateRecordsMapByStoryId(id, { ...records, [id]: actual });
    },
  };

  async function getRecordsMapByStoryId(id: StoryID): Promise<RecordsMap> {
    const name = getRecordsMapFileNameById(id);
    const fullPath = path.join(config.paths.records, name);

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
    const file = path.join(config.paths.records, name);

    return mkfile(file, JSON.stringify(records, null, 2));
  }
}

function getRecordsMapFileNameById(id: StoryID): string {
  const parents = TreeOP.parseInterNodeIDsChain(id);

  const last = parents[parents.length - 1];

  return `${last ?? id}.json`;
}

type RecordsMap = Record<StoryID, JournalRecord[]>;
