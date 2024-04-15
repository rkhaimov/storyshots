import { blue } from '@ant-design/colors';
import { isNil } from '@storyshots/core';
import React from 'react';
import { EntryActions } from '../reusables/EntryActions';
import { ActiveEntryHeader } from '../reusables/EntryHeader';
import { EntryStatus } from '../reusables/EntryStatus';
import { EntryTitle } from '../reusables/EntryTitle';
import { getStoryEntryStatus } from '../reusables/getStoryEntryStatus';
import { RunAction } from '../reusables/RunAction';
import { RunCompleteAction } from '../reusables/RunCompleteAction';
import { RecordsEntry } from './RecordsEntry';
import { ScreenshotsEntry } from './ScreenshotsEntry';
import { Props } from './types';

export const StoryEntry: React.FC<Props> = (props) => {
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
        <EntryTitle
          left={
            <EntryStatus
              status={getStoryEntryStatus(
                props.results,
                props.selection,
                props.story,
              )}
            />
          }
          title={props.story.payload.title}
        />
        <EntryActions waiting={isPlayingOrRunning()}>
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
        <RunAction stories={[story]} selection={selection} run={run} />
        <RunCompleteAction
          stories={[story]}
          selection={selection}
          runComplete={runComplete}
        />
      </>
    );
  }

  function renderResultEntries() {
    const results = props.results.get(props.story.id);

    if (isNil(results) || results.running) {
      return;
    }

    if (results.type === 'error') {
      return;
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

  function isPlayingOrRunning() {
    const { story, results, selection } = props;
    const comparison = results.get(story.id);

    const playing =
      selection.type === 'story' &&
      selection.story.id === story.id &&
      selection.playing;

    const running = comparison && comparison.running;

    return playing || running;
  }
};
