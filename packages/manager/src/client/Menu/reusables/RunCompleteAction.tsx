import { ForwardOutlined } from '@ant-design/icons';
import { PureStory } from '@storyshots/core';
import React from 'react';
import { UseBehaviourProps } from '../../behaviour/types';
import { EntryAction } from './EntryAction';
import { ReadySelection } from '../../behaviour/useSelection/types';

type Props = Pick<UseBehaviourProps, 'runComplete'> & {
  stories: PureStory[];
  selection: ReadySelection;
};

export const RunCompleteAction: React.FC<Props> = ({
  runComplete,
  selection,
  stories,
}) => (
  <EntryAction
    label="Run complete"
    icon={<ForwardOutlined />}
    action={(e) => {
      e.stopPropagation();

      runComplete(stories, selection.preview);
    }}
  />
);
