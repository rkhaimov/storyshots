import { CaretRightOutlined } from '@ant-design/icons';
import { PureStoryTree } from '@storyshots/core';
import React from 'react';
import { UseBehaviourProps } from '../../behaviour/types';
import { EntryAction } from './EntryAction';

type Props = Pick<UseBehaviourProps, 'run'> & {
  stories: PureStoryTree[];
};

export const RunAction: React.FC<Props> = ({ run, stories }) => (
  <EntryAction
    label="Run"
    icon={<CaretRightOutlined />}
    action={(e) => {
      e.stopPropagation();

      run(stories);
    }}
  />
);
