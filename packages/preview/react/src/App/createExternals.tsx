import { JournalStoryConfig } from '@storyshots/core';
import { Story } from '../tree/it';
import { CreateStoryViewProps } from './types';

export function createExternals(
  story: Story,
  preview: CreateStoryViewProps,
  config: JournalStoryConfig,
) {
  const byDefault = preview.createExternals(config);

  const arranged = story.payload.arrange(byDefault, config);

  return preview.createJournalExternals(arranged, config);
}
