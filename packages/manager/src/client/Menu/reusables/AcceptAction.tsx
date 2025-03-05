import { CheckOutlined } from '@ant-design/icons';
import React from 'react';
import { Summary } from '../../../reusables/summary/types';
import { UseBehaviourProps } from '../../behaviour/types';
import { EntryAction } from './EntryAction';

type Props = Pick<UseBehaviourProps, 'accept' | 'accepting'> &
  Pick<Summary, 'changes'>;

export const AcceptAction: React.FC<Props> = ({
  accept,
  changes,
  accepting,
}) => {
  if (changes.length === 0) {
    return;
  }

  return (
    <EntryAction
      label="Accept all"
      icon={<CheckOutlined />}
      disabled={accepting}
      action={async (e) => {
        e.stopPropagation();

        accept(changes);
      }}
    />
  );
};
