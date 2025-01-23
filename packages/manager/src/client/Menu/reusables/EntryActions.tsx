import { HistoryOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { EntryStatus } from './EntryStatus/types';

type Props = React.PropsWithChildren<{
  status: EntryStatus;
  className?: string;
}>;

const _EntryActions: React.FC<Props> = (props) => {
  if (props.status?.type === 'running') {
    return (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
    );
  }

  if (props.status?.type === 'scheduled') {
    return <Spin indicator={<HistoryOutlined style={{ fontSize: 16 }} />} />;
  }

  return <div className={props.className}>{props.children}</div>;
};

export const EntryActions = styled(_EntryActions)`
  display: flex;
  gap: 4px;
`;
