import { createJournal, ManagerState, StoryConfig } from '@storyshots/core';

export function createConfig(manager: ManagerState): StoryConfig {
  const journal = createJournal();

  window.getJournalRecords = journal.__read;

  return {
    device: manager.device,
    testing: manager.testing,
    journal,
  };
}
