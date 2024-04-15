import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';

export const Spinner = () => {
  return (
    <Container>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
`;
