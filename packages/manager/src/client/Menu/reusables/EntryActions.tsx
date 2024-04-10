import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';

type Props = React.PropsWithChildren<{ waiting?: boolean; className?: string }>;

const _EntryActions: React.FC<Props> = (props) => {
  if (props.waiting) {
    return (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
    );
  }

  return <div className={props.className}>{props.children}</div>;
};

export const EntryActions = styled(_EntryActions)`
  display: flex;
  gap: 4px;
`;
