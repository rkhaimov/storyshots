import {
  assertNotEmpty,
  Channel,
  createJournal,
  Device,
  JournalStoryConfig,
  PreviewConfig,
  StoryID,
  TreeOP,
} from '@storyshots/core';
import React from 'react';
import { PreviewProps } from './types';

type Props = { id: StoryID; preview: PreviewProps; config: PreviewConfig };

export const Story: React.FC<Props> = ({
  config: { device, screenshotting },
  id,
  preview,
}) => {
  const { createExternals, createJournalExternals, stories } = preview;

  const config: JournalStoryConfig = {
    device: device ?? (preview.devices as Device[])[0],
    screenshotting,
    journal: createJournal(),
  };

  const story = TreeOP.find(stories, id);

  assertNotEmpty(story);

  const externals = story.payload.arrange(createExternals(config), config);

  setRecordsSource(config.journal.read);

  return story.payload.render(
    createJournalExternals(externals, config),
    config,
  );
};

function setRecordsSource(records: Channel['records']): void {
  (window as never as Channel).records = records;
}
