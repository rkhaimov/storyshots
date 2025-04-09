import { ForwardOutlined } from '@ant-design/icons';
import { StoryTree } from '@core';
import React from 'react';
import { UseBehaviourProps } from '../../behaviour/types';
import { EntryAction } from './EntryAction';

type Props = Pick<UseBehaviourProps, 'runComplete'> & {
  stories: StoryTree;
};

export const RunCompleteAction: React.FC<Props> = ({
  runComplete,
  stories,
}) => (
  <EntryAction
    label="Run complete"
    icon={<ForwardOutlined />}
    action={(e) => {
      e.stopPropagation();

      runComplete(stories);
    }}
  />
);
