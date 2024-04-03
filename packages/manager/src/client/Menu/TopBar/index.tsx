import { Dropdown, MenuProps } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { UseBehaviourProps } from '../../behaviour/types';
import { PureStoryTree, TreeOP } from '@storyshots/core';
import { AutoPlaySelectionInitialized } from '../../behaviour/useAutoPlaySelection';
import { TestResults } from '../../behaviour/useTestResults/types';
import {
  CaretRightOutlined,
  DownOutlined,
  ForwardOutlined,
} from '@ant-design/icons';

export type Props = UseBehaviourProps & {
  stories: PureStoryTree[];
};

export const TopBar: React.FC<Props> = ({
  run,
  runComplete,
  stories,
  selection,
  results,
}): React.ReactNode => {
  if (selection.type === 'initializing') {
    return;
  }

  const waiting = isPlayingOrRunning(selection, results);

  const items: MenuProps['items'] = [
    {
      label: 'Run all stories',
      key: '1',
      icon: <CaretRightOutlined />,
      onClick: () =>
        run(allStories, selection.config.devices, selection.presets),
      disabled: waiting,
    },
    {
      label: 'Run all with all presets',
      key: '2',
      icon: <ForwardOutlined />,
      onClick: () =>
        runComplete(
          allStories,
          selection.config.devices,
          selection.config.presets,
        ),
      disabled: waiting,
    },
  ];

  const allStories = stories.flatMap((it) => {
    switch (it.type) {
      case 'node':
        return TreeOP.toLeafsArray(it.children);
      case 'leaf':
        return [it];
    }
  });

  return (
    <Wrapper>
      <Label>Stories</Label>
      <DropdownButton
        size="small"
        icon={<DownOutlined />}
        menu={{ items }}
        loading={waiting}
        onClick={() =>
          run(allStories, selection.config.devices, selection.presets)
        }
        disabled={waiting}
      >
        {!waiting && <CaretRightOutlined />}
      </DropdownButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DropdownButton = styled(Dropdown.Button)`
  width: fit-content;
`;

const Label = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

function isPlayingOrRunning(
  selection: AutoPlaySelectionInitialized,
  results: TestResults,
) {
  if (selection.type === 'story' && selection.playing) {
    return true;
  }

  return [...results.entries()].some((it) => it[1].running);
}
