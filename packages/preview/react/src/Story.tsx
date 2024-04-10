import {
  assertNotEmpty,
  ManagerState,
  PresetConfigName,
  StoryID,
  TreeOP,
} from '@storyshots/core';
import React from 'react';
import { createJournal } from './journal';
import { Props } from './types';

export const Story: React.FC<
  { id: StoryID } & ManagerState & { config: Props }
> = ({ id, presets, config, screenshotting }) => {
  const { createExternals, createJournalExternals, stories } = config;
  const story = TreeOP.find(stories, id);

  assertNotEmpty(story);

  const journal = createJournal();

  const configured = config.presets.reduce((externals, preset) => {
    const specified = preset.additional.find(
      (it) => it.name === (presets ?? {})[preset.name as PresetConfigName],
    );

    return specified?.configure(externals) ?? externals;
  }, createExternals());

  const arranged = story.payload.arrange(configured, journal, screenshotting);

  config.externals.setRecordsSource(journal.read);

  return story.payload.render(
    createJournalExternals(arranged, journal),
    screenshotting,
  );
};
