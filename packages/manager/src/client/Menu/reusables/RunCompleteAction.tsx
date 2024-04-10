import { ForwardOutlined } from '@ant-design/icons';
import { PureStory } from '@storyshots/core';
import React from 'react';
import { UseBehaviourProps } from '../../behaviour/types';
import { AutoPlaySelectionInitialized } from '../../behaviour/useAutoPlaySelection';
import { EntryAction } from './EntryAction';

type Props = Pick<UseBehaviourProps, 'runComplete'> & {
  stories: PureStory[];
  selection: AutoPlaySelectionInitialized;
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

      runComplete(stories, selection.config.devices, selection.config.presets);
    }}
  />
);
