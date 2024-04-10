import { CaretRightOutlined } from '@ant-design/icons';
import { PureStory, TreeOP } from '@storyshots/core';
import React from 'react';
import { UseBehaviourProps } from '../../behaviour/types';
import { AutoPlaySelectionInitialized } from '../../behaviour/useAutoPlaySelection';
import { EntryAction } from './EntryAction';

type Props = Pick<UseBehaviourProps, 'run'> & {
  stories: PureStory[];
  selection: AutoPlaySelectionInitialized;
};

export const RunAction: React.FC<Props> = ({ run, selection, stories }) => (
  <EntryAction
    label="Run"
    icon={<CaretRightOutlined />}
    action={(e) => {
      e.stopPropagation();

      run(
        TreeOP.toLeafsArray(stories),
        selection.config.devices,
        selection.presets,
      );
    }}
  />
);
