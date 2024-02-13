import {
  CheckOutlined,
  CloseOutlined,
  ExclamationOutlined,
} from '@ant-design/icons';
import { Badge } from 'antd';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';

export type EntryStatus =
  | { type: 'fresh' }
  | { type: 'pass' }
  | { type: 'fail' }
  | { type: 'error'; message: string }
  | null;

type Props = {
  title: React.ReactNode;
  status: EntryStatus;
  style?: CSSProperties | undefined;
};

export const EntryTitle: React.FC<Props> = ({ title, status, style }) => (
  <Title style={style}>
    <span style={{ marginRight: 4 }}>{renderStatus(status)}</span>
    {title}
  </Title>
);

function renderStatus(status: Props['status']): React.ReactNode {
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
}

const Title = styled.span`
  flex: 1 1 auto;
  user-select: none;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
