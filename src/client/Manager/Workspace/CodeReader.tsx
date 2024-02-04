import React from 'react';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

export const CodeReader: React.FC<PropsWithChildren> = ({ children }) => {
  return <ReaderPanel>{children}</ReaderPanel>;
};

const ReaderPanel = styled.div`
  margin: 0 auto;
  overflow: auto;
  width: calc(100% - 24px);
  border: 1px solid #cecece;
  border-radius: 4px;
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
`;
