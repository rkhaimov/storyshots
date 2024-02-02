import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

export const ActionButton: React.FC<{
  icon: React.ReactNode;
  action?: React.MouseEventHandler<HTMLElement>;
}> = ({ action, icon }) => (
  <ActionButtonStyled
    shape="circle"
    size="small"
    onClick={action}
    icon={icon}
  />
);

const ActionButtonStyled = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  box-shadow: none;
  border: none;

  &:hover {
    transform: scale(1.1);
  }
`;
