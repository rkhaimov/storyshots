import { JournalStoryConfig } from '@storyshots/core';
import {
  createJournalPetsAPI,
  createMockPetsAPI,
  PetsAPI,
} from './pets-api.testing';

export type Externals = PetsAPI;

export const createMockExternals = (): Externals => createMockPetsAPI();

export const createJournalExternals = (
  externals: Externals,
  config: JournalStoryConfig,
) => createJournalPetsAPI(externals, config);
