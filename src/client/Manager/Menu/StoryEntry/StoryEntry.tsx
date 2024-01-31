import React from 'react';
import styled from 'styled-components';
import { isNil } from '../../../../reusables/utils';
import { Actions } from './Actions';
import { ErrorsEntry } from './ErrorsEntry';
import { RecordsEntry } from './RecordsEntry';
import { ScreenshotsEntry } from './ScreenshotsEntry';
import { Props } from './types';

export const StoryEntry: React.FC<Props> = (props) => {
  return (
    <li>
      <EntryHeader onClick={() => props.setStory(props.story)}>
        {props.story.title}
        <Actions {...props} />
      </EntryHeader>
      {renderResultEntries()}
    </li>
  );

  function renderResultEntries() {
    const results = props.results.get(props.story.id);

    if (isNil(results) || results.running) {
      return;
    }

    if (results.type === 'error') {
      return <ErrorsEntry {...props} results={results} />;
    }

    return (
      <>
        <RecordsEntry {...props} results={results} />
        <ScreenshotsEntry {...props} results={results} />
      </>
    );
  }
};

const EntryHeader = styled.div`
  cursor: pointer;
`;
