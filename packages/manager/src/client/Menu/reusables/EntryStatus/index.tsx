import {
  CheckOutlined,
  CloseOutlined,
  ExclamationOutlined,
} from '@ant-design/icons';
import { Badge } from 'antd';
import React from 'react';
import { Props } from './types';

export const EntryStatus: React.FC<Props> = ({ status }) => {
  if (status?.type === 'pass') {
    return <CheckOutlined style={{ color: '#389e0d' }} />;
  }

  if (status?.type === 'fail') {
    return <CloseOutlined style={{ color: '#f5222d' }} />;
  }

  if (status?.type === 'fresh') {
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

  if (status?.type === 'error') {
    return (
      <ExclamationOutlined
        style={{ color: '#f5222d' }}
        title={status.message}
      />
    );
  }

  return null;
};
