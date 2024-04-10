import { PureStoryTree, TreeOP } from '@storyshots/core';
import React from 'react';
import styled from 'styled-components';
import { UseBehaviourProps } from '../../behaviour/types';
import { AutoPlaySelectionInitialized } from '../../behaviour/useAutoPlaySelection';
import { EntryActions } from '../reusables/EntryActions';
import { EntryTitle } from '../reusables/EntryTitle';
import { RunAction } from '../reusables/RunAction';
import { RunCompleteAction } from '../reusables/RunCompleteAction';

export type Props = UseBehaviourProps & {
  stories: PureStoryTree[];
  selection: AutoPlaySelectionInitialized;
};

export const TopBar: React.FC<Props> = ({
  run,
  runComplete,
  stories,
  selection,
  results,
}) => {
  const nodes = TreeOP.toLeafsArray(stories);

  return (
    <StatusHeader>
      <EntryTitle
        left={<></>}
        title="Stories"
        style={{ fontSize: 16, fontWeight: 600 }}
      />
      <EntryActions waiting={isPlayingOrRunning()}>
        <RunAction stories={nodes} selection={selection} run={run} />
        <RunCompleteAction
          stories={nodes}
          selection={selection}
          runComplete={runComplete}
        />
      </EntryActions>
    </StatusHeader>
  );

  function isPlayingOrRunning() {
    if (selection.type === 'story' && selection.playing) {
      return true;
    }

    return [...results.entries()].some(([, test]) => test.running);
  }
};

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 2px 5px 8px;
`;
