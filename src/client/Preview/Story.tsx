import React from 'react';

import { StoryID } from '../../reusables/types';
import { createJournal } from '../createJournal';
import { Props } from './types';
import { TreeOP } from '../../reusables/tree';
import { assertNotEmpty } from '../../reusables/utils';

export const Story: React.FC<{ id: StoryID } & Props> = ({
  id,
  stories,
  createExternals,
  createJournalExternals,
}) => {
  const story = TreeOP.find(stories, id);

  assertNotEmpty(story);

  const journal = createJournal();

  const externals = createJournalExternals(
    story.payload.arrange(createExternals(), journal),
    journal,
  );

  window.readJournalRecords = journal.read;

  return story.payload.render(externals);
};
