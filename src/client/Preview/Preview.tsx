import React from 'react';
import { FinalClientConfig } from '../create-configure-client/types';
import { isNil } from '../../reusables/utils';
import { StoryID } from '../../reusables/types';
import { findStoryLikeByID } from '../reusables/findStoryLikeByID';
import { createJournal } from '../createJournal';

type Props = FinalClientConfig & {
  id?: StoryID;
};

export const Preview: React.FC<Props> = (props) => {
  if (isNil(props.id)) {
    return <Placeholder />;
  }

  return <Story id={props.id} {...props} />;
};

const Placeholder: React.FC = () => <h1>Select a story</h1>;

const Story: React.FC<{ id: StoryID } & Props> = ({
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
