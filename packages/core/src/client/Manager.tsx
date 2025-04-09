import React from 'react';
import { useBehaviour } from './behaviour';
import { Layout } from './Layout';
import { Main } from './Main';
import { Menu } from './Menu';
import { StatusPaneArea } from './StatusPane';

export const Manager: React.FC = () => {
  const behaviour = useBehaviour();

  return (
    <Layout>
      <Layout.Top>
        <Layout.Sider>
          <Menu {...behaviour} />
        </Layout.Sider>
        <Layout.Main>
          <Main {...behaviour} />
        </Layout.Main>
      </Layout.Top>
      <Layout.Bottom>
        <StatusPaneArea {...behaviour} />
      </Layout.Bottom>
    </Layout>
  );
};
