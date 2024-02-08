import { Layout } from 'antd';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { DiffReader } from './DiffReader';
import { DiffImgViewer } from './DiffImgViewer';
import { ImgViewer } from './ImgViewer';

const { Header } = Layout;

type Props = PropsWithChildren & {
  title?: string;
  actions?: React.ReactNode;
};

export const Workspace: React.FC<Props> & {
  DiffReader: typeof DiffReader;
  ImgViewer: typeof ImgViewer;
  DiffImgViewer: typeof DiffImgViewer;
} = ({ children, actions, title }) => {
  return (
    <Layout>
      <TopPanel>
        <Title>{title}</Title>
        <Actions>{actions}</Actions>
      </TopPanel>
      <Content>{children}</Content>
    </Layout>
  );
};

Workspace.DiffReader = DiffReader;
Workspace.ImgViewer = ImgViewer;
Workspace.DiffImgViewer = DiffImgViewer;

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

const Content = styled.div`
  display: flex;
  background-color: #fff;
  padding: 12px 0;
  max-height: calc(100vh - 64px);
`;
