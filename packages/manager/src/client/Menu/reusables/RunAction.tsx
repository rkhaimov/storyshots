import { CaretRightOutlined } from '@ant-design/icons';
import { PureStory, TreeOP } from '@storyshots/core';
import React from 'react';
import { UseBehaviourProps } from '../../behaviour/types';
import { EntryAction } from './EntryAction';
import { ReadySelection } from '../../behaviour/useSelection/types';

type Props = Pick<UseBehaviourProps, 'run'> & {
  stories: PureStory[];
  selection: ReadySelection;
};

export const RunAction: React.FC<Props> = ({ run, selection, stories }) => (
  <EntryAction
    label="Run"
    icon={<CaretRightOutlined />}
    action={(e) => {
      e.stopPropagation();

      run(
        TreeOP.toLeafsArray(stories),
        { device: selection.config.device },
        selection.preview,
      );
    }}
  />
);
