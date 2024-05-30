import { blue } from '@ant-design/colors';
import { CheckOutlined } from '@ant-design/icons';
import { isNil } from '@storyshots/core';
import React from 'react';
import styled from 'styled-components';
import { EntryAction } from '../reusables/EntryAction';
import { EntryActions } from '../reusables/EntryActions';
import { ActiveEntryHeader, EntryHeader } from '../reusables/EntryHeader';
import { HighlightableEntry } from '../reusables/EntryStatus';
import { EntryTitle } from '../reusables/EntryTitle';
import { getStoryEntryStatus } from '../reusables/getStoryEntryStatus';
import { RunAction } from '../reusables/RunAction';
import { RunCompleteAction } from '../reusables/RunCompleteAction';
import { RecordsEntry } from './RecordsEntry';
import { ScreenshotsEntry } from './ScreenshotsEntry';
import { Props } from './types';

export const StoryEntry: React.FC<Props> = (props) => {
  const status = getStoryEntryStatus(
    props.results,
    props.selection,
    props.story,
  );

  return (
    <li>
      <ActiveEntryHeader
        $offset={8}
        $level={props.level}
        $active={isActive()}
        $color={blue[0]}
        onClick={() => props.setStory(props.story.id)}
        role="menuitem"
        aria-label={props.story.payload.title}
      >
        <HighlightableEntry
          status={status?.type}
          title={props.story.payload.title}
        />
        <EntryActions waiting={status?.type === 'running'}>
          {renderStoryActions()}
        </EntryActions>
      </ActiveEntryHeader>
      {renderResultEntries()}
    </li>
  );

  function renderStoryActions() {
    const { results, story, run, runComplete, selection } = props;

    const comparison = results.get(story.id);

    if (comparison && comparison.running) {
      return;
    }

    if (selection.type === 'initializing') {
      return;
    }

    return (
      <>
        {renderAcceptAllAction()}
        <RunAction stories={[story]} selection={selection} run={run} />
        <RunCompleteAction
          stories={[story]}
          selection={selection}
          runComplete={runComplete}
        />
      </>
    );
  }

  function renderAcceptAllAction() {
    if (status?.type === 'fresh' || status?.type === 'fail') {
      return (
        <EntryAction
          label="Accept all"
          icon={<CheckOutlined />}
          action={async (e) => {
            e.stopPropagation();

            for (const record of status.records) {
              await props.acceptRecords(record);
            }

            for (const screenshot of status.screenshots) {
              await props.acceptScreenshot(screenshot);
            }
          }}
        />
      );
    }
  }

  function renderResultEntries() {
    const results = props.results.get(props.story.id);

    if (isNil(results) || results.running) {
      return;
    }

    if (results.type === 'error') {
      return;
    }

    if (results.details.length === 1) {
      return (
        <>
          <RecordsEntry {...props} details={results.details[0]} />
          <ScreenshotsEntry {...props} details={results.details[0]} />
        </>
      );
    }

    return results.details.map((detail) => (
      <li>
        <DeviceEntryHeader $level={props.level} $offset={8}>
          <EntryTitle title={detail.device.name} />
        </DeviceEntryHeader>
        <RecordsEntry {...props} details={detail} />
        <ScreenshotsEntry {...props} details={detail} />
      </li>
    ));
  }

  function isActive() {
    return (
      props.selection.type === 'story' &&
      props.selection.story.id === props.story.id
    );
  }
};

const DeviceEntryHeader = styled(EntryHeader)`
  font-style: italic;
`;
