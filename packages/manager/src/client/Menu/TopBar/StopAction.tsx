import { StopOutlined } from '@ant-design/icons';
import { Summary } from '../../../reusables/summary/types';
import { EntryAction } from '../reusables/EntryAction';
import React from 'react';
import { UseBehaviourProps } from '../../behaviour/types';

type Props = Pick<UseBehaviourProps, 'stopAll'> & { summary: Summary };

export const StopAction: React.FC<Props> = ({ stopAll, summary }) => {
  if (summary.scheduled === 0) {
    return;
  }

  return (
    <EntryAction
      label="Stop"
      icon={<StopOutlined />}
      action={(e) => {
        e.stopPropagation();

        stopAll();
      }}
    />
  );
};
