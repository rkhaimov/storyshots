import { Layout as AntdLayout, theme } from 'antd';
import React from 'react';

export function Layout(props: React.PropsWithChildren) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {props.children}
    </div>
  );
}

Layout.Top = (props: React.PropsWithChildren) => (
  <AntdLayout hasSider style={{ flex: 1 }}>
    {props.children}
  </AntdLayout>
);

Layout.Bottom = (props: React.PropsWithChildren) => props.children;

Layout.Sider = (props: React.PropsWithChildren) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <AntdLayout.Sider
      width={250}
      style={{
        background: colorBgContainer,
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRight: '1px solid #cecece',
      }}
    >
      {props.children}
    </AntdLayout.Sider>
  );
};

Layout.Main = (props: React.PropsWithChildren) => (
  <main
    style={{
      width: '100%',
      backgroundColor: 'white',
    }}
  >
    {props.children}
  </main>
);
