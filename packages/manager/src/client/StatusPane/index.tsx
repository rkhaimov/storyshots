import convert from 'ansi-to-html';
import { PureStory, PureStoryTree, TreeOP } from '@storyshots/core';
import { Segmented } from 'antd';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { UseBehaviourProps } from '../behaviour/types';
import { EntryErrorStatus } from '../Menu/reusables/EntryStatus/types';
import { getStoryEntryStatus } from '../Menu/reusables/getStoryEntryStatus';

export const StatusPaneArea: React.FC<UseBehaviourProps> = (props) => {
  const { selection, statusPaneOpen } = props;
  const [errorsAreActive, setErrorsAreActive] = useState(true);

  if (selection.type === 'initializing' || !statusPaneOpen) {
    return null;
  }

  const errors = toAllErrors(selection.preview.stories, props);
  const failures = toAllFailures(selection.preview.stories, props);

  return (
    <Pane>
      <Header>
        <span style={{ lineHeight: 1 }}>Status:</span>
        <TabPanes
          value={errorsAreActive ? 'errors' : 'failures'}
          onChange={(it) => setErrorsAreActive(it === 'errors')}
          options={[
            {
              value: 'errors',
              label: (
                <span>
                  Errors{' '}
                  <span style={{ color: 'rgb(0 0 0 / 50%)' }}>
                    {errors.size}
                  </span>
                </span>
              ),
            },
            {
              value: 'failures',
              label: (
                <span>
                  Failures{' '}
                  <span style={{ color: 'rgb(0 0 0 / 50%)' }}>
                    {failures.length}
                  </span>
                </span>
              ),
            },
          ]}
        />
      </Header>
      {errorsAreActive ? (
        <StatusEntries aria-label="Errors">
          {[...errors].map(([story, result]) => (
            <StatusEntry
              active$={isActive(story)}
              aria-label={story.payload.title}
              onClick={() => props.setStory(story.id)}
            >
              <span style={{ fontWeight: 'bold' }}>{story.payload.title}</span>
              <div
                style={{ margin: 0 }}
                dangerouslySetInnerHTML={{
                  __html: new convert({
                    escapeXML: true,
                    newline: true,
                  }).toHtml(result.message),
                }}
              />
            </StatusEntry>
          ))}
        </StatusEntries>
      ) : (
        <StatusEntries aria-label="Failures">
          {failures.map((story) => (
            <StatusEntry
              active$={isActive(story)}
              aria-label={story.payload.title}
              onClick={() => props.setStory(story.id)}
            >
              <span style={{ fontWeight: 'bold' }}>{story.payload.title}</span>
            </StatusEntry>
          ))}
        </StatusEntries>
      )}
    </Pane>
  );

  function isActive(story: PureStory) {
    return selection.type === 'story' && story.id === selection.story.id;
  }
};

function toAllFailures(
  stories: PureStoryTree[],
  { results, selection }: UseBehaviourProps,
): PureStory[] {
  return TreeOP.toLeafsArray(stories).filter(
    (story) => getStoryEntryStatus(results, selection, story)?.type === 'fail',
  );
}

function toAllErrors(
  stories: PureStoryTree[],
  { results, selection }: UseBehaviourProps,
) {
  return TreeOP.toLeafsArray(stories).reduce((errors, story) => {
    const status = getStoryEntryStatus(results, selection, story);

    if (status?.type === 'error') {
      errors.set(story, status);
    }

    return errors;
  }, new Map<PureStory, EntryErrorStatus>());
}

const Pane = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgb(206, 206, 206);
  height: 30vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding-left: 8px;
  height: 30px;
  border-bottom: 1px solid rgb(206, 206, 206);
`;

const TabPanes = styled(Segmented)`
  margin: 0 10px;
  border-radius: 0;
  padding: 0;

  .ant-segmented-item-selected {
    border-radius: 0;
    box-shadow: none;
  }
`;

const StatusEntries = styled.ul`
  overflow: auto;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const StatusEntry = styled.li<{ active$: boolean }>`
  padding: 10px;

  ${(props) =>
    props.active$ &&
    css`
      background-color: #e6f4ff;
    `}

  ${(props) =>
    !props.active$ &&
    css`
      cursor: pointer;

      &:hover {
        background-color: #fafafa;
      }
    `}
`;
