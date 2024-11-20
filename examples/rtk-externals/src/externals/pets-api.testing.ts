import { JournalStoryConfig } from '@storyshots/core';
import { ExtractRtkAPI } from '@storyshots/rtk-externals';
import { enhancedApi } from './pets-api';

export type PetsAPI = ExtractRtkAPI<typeof enhancedApi>;

export function createMockPetsAPI(): PetsAPI {
  return {
    findPetsByStatus: async () => [],
    addPet: async () => {},
  };
}

export function createJournalPetsAPI(
  api: PetsAPI,
  config: JournalStoryConfig,
): PetsAPI {
  return { ...api, addPet: config.journal.asRecordable('addPet', api.addPet) };
}
