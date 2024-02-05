import React from 'react';
import styled from 'styled-components';
import { blue } from '@ant-design/colors';
import { isNil } from '../../../../reusables/utils';
import { Actions } from './Actions';
import { ErrorsEntry } from './ErrorsEntry';
import { RecordsEntry } from './RecordsEntry';
import { ScreenshotsEntry } from './ScreenshotsEntry';
import { Props } from './types';

export const StoryEntry: React.FC<Props> = (props) => {
  return (
    <li>
      <EntryHeader
        level={props.level}
        active={isActive()}
        onClick={() => props.setStory(props.story)}
      >
        <EntryTitle title={props.story.title}>{props.story.title}</EntryTitle>
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

  function isActive() {
    return (
      props.selection.type === 'story' &&
      props.selection.story.id === props.story.id
    );
  }
};

const EntryHeader = styled.div.attrs<{ level: number; active: boolean }>(
  (props) => ({
    level: props.level,
    active: props.active,
  }),
)`
  height: 25px;
  display: flex;
  align-items: center;
  padding: 2px;
  padding-left: ${(props) => `${props.level * 24 + 8}px`};
  background: ${({ active }) => active ? blue[0] : ''};
  transition: 0.2s ease-in-out;
  cursor: pointer;

  &:hover,
  &:focus {
    background: ${({ active }) => active ? blue[0] : '#fafafa'};
  }
`;

const EntryTitle = styled.span`
  flex: 1 1 auto;
  font-size: 14px;
  min-width: 100px;
  margin-top: -2px;
  padding: 0 4px;
  user-select: none;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
