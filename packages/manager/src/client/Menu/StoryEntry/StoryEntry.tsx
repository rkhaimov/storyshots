import { blue } from '@ant-design/colors';
import { isNil } from '@storyshots/core';
import React from 'react';
import styled from 'styled-components';
import { DeviceToTestRunState } from '../../../reusables/runner/types';
import { AcceptAction } from '../reusables/AcceptAction';
import { EntryActions } from '../reusables/EntryActions';
import { ActiveEntryHeader, EntryHeader } from '../reusables/EntryHeader';
import { EntryTitle } from '../reusables/EntryTitle';
import { getStatusFromSummary } from '../reusables/getStatusFromSummary';
import { HighlightableEntry } from '../reusables/HighlightableEntry';
import { RunAction } from '../reusables/RunAction';
import { RunCompleteAction } from '../reusables/RunCompleteAction';
import { getStoryEntrySummary } from './getStoryEntrySummary';
import { RecordsEntry } from './RecordsEntry';
import { ScreenshotsEntry } from './ScreenshotsEntry';
import { DeviceToTestRunResult, Props } from './types';

export const StoryEntry: React.FC<Props> = (props) => {
  const { story } = props;
  const summary = getStoryEntrySummary(story, props);
  const status = getStatusFromSummary(summary);

  return (
    <li aria-label={story.title}>
      <ActiveEntryHeader
        $offset={8}
        $level={props.level}
        $active={isActive()}
        $color={blue[0]}
        onClick={() => props.setStory(story.id)}
        role="menuitem"
      >
        <HighlightableEntry status={status} title={story.title} />
        <EntryActions status={status}>
          <AcceptAction
            changes={summary.changes}
            accept={props.accept}
            accepting={props.accepting}
          />
          <RunAction stories={[story]} run={props.run} />
          <RunCompleteAction
            stories={[story]}
            runComplete={props.runComplete}
          />
        </EntryActions>
      </ActiveEntryHeader>
      {renderResultEntries()}
    </li>
  );

  function renderResultEntries() {
    const results = toDoneResultsOnly(props.results.get(story.id));

    if (results.length === 0) {
      return;
    }

    if (results.length === 1) {
      return (
        <>
          <RecordsEntry {...props} result={results[0]} />
          <ScreenshotsEntry {...props} result={results[0]} />
        </>
      );
    }

    return results.map((result, index) => (
      <li aria-label={result.device.name} key={index}>
        <DeviceEntryHeader $level={props.level} $offset={8}>
          <EntryTitle title={result.device.name} />
        </DeviceEntryHeader>
        <RecordsEntry {...props} result={result} />
        <ScreenshotsEntry {...props} result={result} />
      </li>
    ));
  }

  function isActive() {
    return (
      props.selection.type === 'story' && props.selection.story.id === story.id
    );
  }
};

function toDoneResultsOnly(state: DeviceToTestRunState | undefined) {
  if (isNil(state)) {
    return [];
  }

  return Array.from(state.entries()).reduce((results, [device, result]) => {
    if (result.type === 'done' && result.details.type === 'success') {
      results.push({ device, details: result.details.data });
    }

    return results;
  }, [] as DeviceToTestRunResult[]);
}

const DeviceEntryHeader = styled(EntryHeader)`
  font-style: italic;
`;
