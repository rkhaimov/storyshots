import React from 'react';
import { StoryID } from '../../reusables/types';
import { createJournal } from '../createJournal';
import { findStoryLikeByID } from '../reusables/findStoryLikeByID';
import { Props } from './types';

export const Story: React.FC<{ id: StoryID } & Props> = ({
  id,
  stories,
  createExternals,
  createJournalExternals,
}) => {
  const story = findStoryLikeByID(stories, id);

  const journal = createJournal();

  const externals = createJournalExternals(
    story.arrange(createExternals(), journal),
    journal,
  );

  window.readJournalRecords = journal.read;

  return story.render(externals);
};
