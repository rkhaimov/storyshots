import React from 'react';
import styled from 'styled-components';
import { blue } from '@ant-design/colors';
import { isNil } from '../../../../reusables/utils';
import { Fail, Fresh, Pass } from '../../../reusables/Statuses';
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
        style={{ background: isActive() ? blue[0] : '' }}
      >
        <EntryTitle title={props.story.title}>
          {renderStoryStatus()}
          <span>{props.story.title}</span>
        </EntryTitle>
        <Actions {...props} />
      </EntryHeader>
      {renderResultEntries()}
    </li>
  );

  function renderStoryStatus() {
    const results = props.results.get(props.story.id);

    if (isNil(results) || results.running) {
      return;
    }

    if (results.type === 'success') {
      const types = [
        results.records.type,
        results.screenshots.primary.results.final.type,
        ...results.screenshots.primary.results.others.map(
          ({ result }) => result.type,
        ),
      ];

      if (types.includes('fail')) {
        return <Fail />;
      }

      if (types.includes('fresh')) {
        return <Fresh />;
      }

      if (types.includes('pass')) {
        return <Pass />;
      }
    }
  }

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
  background: ${({ active }) => (active ? blue[0] : '')};
  transition: 0.2s ease-in-out;
  cursor: pointer;

  &:hover,
  &:focus {
    background: ${({ active }) => (active ? blue[0] : '#fafafa')};
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

  & > span:last-of-type {
    margin-left: 6px;
  }
`;
