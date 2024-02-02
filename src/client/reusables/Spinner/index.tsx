import React, { PropsWithChildren } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

type SpinnerProps = {
  AbsoluteStretched: typeof AbsoluteStretched;
};

export const Spinner: React.FC<PropsWithChildren> & SpinnerProps = ({
  children,
}) => children;

export const AbsoluteStretched = () => {
  return (
    <Container>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </Container>
  );
};

Spinner.AbsoluteStretched = AbsoluteStretched;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
`;
