import { StopOutlined } from '@ant-design/icons';
import { EntryAction } from '../reusables/EntryAction';
import React from 'react';
import { UseBehaviourProps } from '../../behaviour/types';

type Props = Pick<UseBehaviourProps, 'stopAll'>;

export const StopAction: React.FC<Props> = ({ stopAll }) => (
  <EntryAction
    label="Stop"
    icon={<StopOutlined />}
    action={(e) => {
      e.stopPropagation();

      stopAll();
    }}
  />
);
