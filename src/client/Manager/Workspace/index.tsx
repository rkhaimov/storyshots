import { Layout } from 'antd';
import React, { PropsWithChildren } from 'react';
import { CodeReader } from './CodeReader';
import styled from 'styled-components';

const { Header } = Layout;

type Props = PropsWithChildren & {
  actions?: React.ReactNode;
};

export const Workspace: React.FC<Props> & { CodeReader: typeof CodeReader } = ({
  children,
  actions,
}) => {
  return (
    <Layout>
      <TopPanel>{actions}</TopPanel>
      <Content>{children}</Content>
    </Layout>
  );
};

Workspace.CodeReader = CodeReader;

const TopPanel = styled(Header)`
  background-color: #fafafa;
`;

const Content = styled.div`
  display: flex;
  background-color: #fff;
  padding: 12px 0;
  max-height: calc(100vh - 64px);
`;
