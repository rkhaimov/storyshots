import { Device, JournalRecord, StoryID, TreeOP } from '@storyshots/core';
import path from 'path';
import { DeviceAndRecord } from '../../../../reusables/types';

import { ManagerConfig } from '../../../types';
import { exists, mkdir, mkfile, read } from './utils';

export async function createRecordsBaseline(config: ManagerConfig) {
  return {
    getExpectedRecords: async (
      id: StoryID,
      device: Device,
    ): Promise<JournalRecord[] | undefined> => {
      const records = await getRecordsMap(id, device);

      return records[id];
    },
    acceptRecords: async (
      id: StoryID,
      { records, device }: DeviceAndRecord,
    ) => {
      const baseline = await getRecordsMap(id, device);

      return updateRecordsMap(id, device, {
        ...baseline,
        [id]: records,
      });
    },
  };

  async function getRecordsMap(
    id: StoryID,
    device: Device,
  ): Promise<StoryIDToRecords> {
    const name = getRecordsMapFileName(id, device);
    const fullPath = path.join(config.paths.records, name);

    if (!(await exists(fullPath))) {
      return {};
    }

    return JSON.parse((await read(fullPath)).toString());
  }

  async function updateRecordsMap(
    id: StoryID,
    device: Device,
    records: StoryIDToRecords,
  ): Promise<void> {
    const name = getRecordsMapFileName(id, device);
    const file = path.join(config.paths.records, name);
    const dir = path.dirname(file);

    if (!(await exists(dir))) {
      await mkdir(dir);
    }

    return mkfile(file, JSON.stringify(records, null, 2));
  }
}

function getRecordsMapFileName(id: StoryID, device: Device): string {
  const parents = TreeOP.parseInterNodeIDsChain(id);

  const last = parents[parents.length - 1];

  return path.join(device.name, `${last ?? id}.json`);
}

type StoryIDToRecords = Record<StoryID, JournalRecord[]>;
