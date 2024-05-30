import { CheckOutlined, CloseOutlined, ExclamationOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import React from 'react';
import { EntryTitle } from '../EntryTitle';
import { Props } from './types';

export const HighlightableEntry: React.FC<Props> = (props) => {
  return (
    <EntryTitle
      {...props}
      left={
        <>
          {renderStatusIcon(props)}
          {props.left}
        </>
      }
    />
  );
};

function renderStatusIcon({ status }: Props) {
  if (status === 'pass') {
    return <CheckOutlined style={{ color: '#389e0d' }} />;
  }

  if (status === 'fail') {
    return <CloseOutlined style={{ color: '#f5222d' }} />;
  }

  if (status === 'fresh') {
    return (
      <Badge
        color="hwb(205 6% 9%)"
        style={{
          minWidth: 14,
          textAlign: 'center',
        }}
      />
    );
  }

  if (status === 'error') {
    return <ExclamationOutlined style={{ color: '#f5222d' }} />;
  }

  return null;
}
