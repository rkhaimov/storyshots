import { Layout } from 'antd';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const { Header } = Layout;

type Props = PropsWithChildren & {
  title?: string;
  firstAction?: React.ReactNode;
  actions?: React.ReactNode;
};

export const Workspace: React.FC<Props> = ({
  children,
  firstAction,
  actions,
  title,
}) => {
  return (
    <Layout>
      <TopPanel>
        <FirstAction>{firstAction}</FirstAction>
        <Title>{title}</Title>
        <Actions>{actions}</Actions>
      </TopPanel>
      <Content>{children}</Content>
    </Layout>
  );
};

const TopPanel = styled(Header)`
  display: flex;
  justify-content: space-between;
  background-color: #fafafa;
  border-bottom: 1px solid #cecece;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #9c9c9c;
`;

const Actions = styled.div`
  margin: 0 2px 0 16px;
`;

const FirstAction = styled.div`
  margin: 0 16px 0 2px;
`;

const Content = styled.div`
  display: flex;
  background-color: #fff;
  padding: 12px 0;
  max-height: calc(100vh - 64px);
`;
