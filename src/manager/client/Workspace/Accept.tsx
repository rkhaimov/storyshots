import React from 'react';
import { Button } from 'antd';
import { green } from '@ant-design/colors';
import { CheckOutlined } from '@ant-design/icons';
import styled from 'styled-components';

type Props = {
  onAction: () => void;
};

export const ActionAccept: React.FC<Props> = ({ onAction }) => (
  <StyledButton type="primary" icon={<CheckOutlined />} onClick={onAction}>
    Accept
  </StyledButton>
);

const StyledButton = styled(Button)`
    background-color: ${green[6]};

    &:hover,
    &:focus {
        background-color: ${green[5]} !important;
    }
`;
