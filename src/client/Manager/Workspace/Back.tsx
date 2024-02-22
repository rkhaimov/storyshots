import React from 'react';
import { Button } from 'antd';
import { blue } from '@ant-design/colors';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';

type Props = {
  onAction: () => void;
};

export const ActionBack: React.FC<Props> = ({ onAction }) => (
  <StyledButton type="primary" icon={<ArrowLeftOutlined />} onClick={onAction}>
    Back
  </StyledButton>
);

const StyledButton = styled(Button)`
  background-color: ${blue[6]};

  &:hover,
  &:focus {
    background-color: ${blue[5]} !important;
  }
`;
