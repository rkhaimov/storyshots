import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Layout, Menu, theme } from 'antd';
import { createGlobalStyle } from 'styled-components';

const { Sider, Content } = Layout;

const div = document.createElement('div');

div.setAttribute('id', 'root');

document.body.appendChild(div);

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }

  body, html, #root {
    height: 100%;
  }
`;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [count, setCount] = useState(0);

  return (
    <>
      <GlobalStyle />
      <Layout hasSider style={{ height: '100%' }}>
        <Sider style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            theme="light"
            items={[
              {
                key: '1',
                label: 'First story',
              },
              {
                key: '2',
                label: 'First Group',
                children: [
                  {
                    key: '3',
                    label: 'Second story',
                  },
                ],
              },
            ]}
            selectedKeys={['1']}
            onClick={console.log}
            style={{ height: '100%' }}
          />
        </Sider>
        <Content
          style={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1>{count}</h1>
          <button onClick={() => setCount((prev) => prev + 1)}>
            Increment
          </button>
        </Content>
      </Layout>
    </>
  );
};

ReactDOM.createRoot(div).render(<App />);
