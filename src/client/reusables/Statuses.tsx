import React from 'react';
import styled from 'styled-components';
import { Badge } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

export const Fresh: React.FC = () => {
  return <NewOutlined color="hwb(205 6% 9%)" />;
};

export const Fail: React.FC = () => {
  return <CloseOutlined style={{ color: '#f5222d' }} />;
};

export const Pass: React.FC = () => {
  return <CheckOutlined style={{ color: '#389e0d' }} />;
};

const NewOutlined = styled(Badge)`
  min-width: 14px;
  text-align: center;
`;
