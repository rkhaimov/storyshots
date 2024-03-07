import React from 'react';

import { StoryID } from '../../reusables/story';
import { TreeOP } from '../../reusables/tree';
import { assertNotEmpty } from '../../reusables/utils';
import { createJournal } from './journal';
import { Props } from './types';

export const Story: React.FC<
  { id: StoryID; selectedPresets: SelectedPresets } & Props
> = ({
  id,
  stories,
  createExternals,
  createJournalExternals,
  presets,
  selectedPresets,
}) => {
  const story = TreeOP.find(stories, id);

  assertNotEmpty(story);

  const journal = createJournal();

  const initExternals = presets.reduce((prev, curr) => {
    for (const preset of curr.additional) {
      if (preset.name === selectedPresets[curr.name]) {
        return preset.prepare(prev);
      }
    }

    return curr.primary.prepare(prev);
  }, createExternals());

  const externals = createJournalExternals(
    story.payload.arrange(initExternals, journal),
    journal,
  );

  window.readJournalRecords = journal.read;

  return story.payload.render(externals);
};
