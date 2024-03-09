import React from 'react';

import {
  assertNotEmpty,
  isNil,
  ManagerState,
  setRecords,
  StoryID,
  TreeOP,
} from '@storyshots/core';
import { createJournal } from './journal';
import { Props } from './types';

export const Story: React.FC<
  { id: StoryID } & ManagerState & { config: Props }
> = ({ id, presets, config }) => {
  const { createExternals, createJournalExternals, stories } = config;
  const story = TreeOP.find(stories, id);

  assertNotEmpty(story);

  const journal = createJournal();

  const configured = config.presets.reduce((externals, preset) => {
    const specified = preset.additional.find(
      (it) => it.name === (presets ?? {})[preset.name],
    );

    return isNil(specified)
      ? preset.default.prepare(externals)
      : specified.prepare(externals);
  }, createExternals());

  const arranged = story.payload.arrange(configured, journal);
  const journaled = createJournalExternals(arranged, journal);

  setRecords(journal.read);

  return story.payload.render(journaled);
};
