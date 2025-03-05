import {
  createJournal,
  JournalStoryConfig,
  ManagerState,
  StoryConfig,
} from '@storyshots/core';

export function createConfig(manager: ManagerState): JournalStoryConfig {
  const config: StoryConfig = {
    device: manager.device,
    testing: manager.testing,
  };

  const journal = createJournal();

  window.getJournalRecords = journal.__read;

  return { ...config, journal };
}
