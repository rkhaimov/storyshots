import {
  assertNotEmpty,
  createJournal,
  Device,
  JournalStoryConfig,
  ManagerState,
  StoryID,
  TreeOP,
} from '@storyshots/core';
import React from 'react';
import { PreviewProps } from './types';

type Props = { id: StoryID; preview: PreviewProps; state: ManagerState };

export const Story: React.FC<Props> = ({
  id,
  preview,
  state: { device, presets, screenshotting },
}) => {
  const { createExternals, createJournalExternals, stories } = preview;

  const config: JournalStoryConfig = {
    device: device ?? (preview.devices as Device[])[0],
    presets,
    screenshotting,
    journal: createJournal(),
  };

  const story = TreeOP.find(stories, id);

  assertNotEmpty(story);

  const externals = story.payload.arrange(createExternals(config), config);

  preview.externals.setRecordsSource(config.journal.read);

  return story.payload.render(
    createJournalExternals(externals, config),
    config,
  );
};
