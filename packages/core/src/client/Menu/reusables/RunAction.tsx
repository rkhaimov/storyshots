import { CaretRightOutlined } from '@ant-design/icons';
import { StoryTree } from '@core';
import React from 'react';
import { UseBehaviourProps } from '../../behaviour/types';
import { EntryAction } from './EntryAction';

type Props = Pick<UseBehaviourProps, 'run'> & {
  stories: StoryTree;
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
