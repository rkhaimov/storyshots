import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

type Props = {
  icon: React.ReactNode;
  action?: React.MouseEventHandler<HTMLElement>;
};

export const EntryAction: React.FC<Props> = ({ action, icon }) => (
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
