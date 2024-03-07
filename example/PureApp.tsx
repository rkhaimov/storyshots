import React from 'react';
import { App, ConfigProvider, theme } from 'antd';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch } from 'wouter';
import { ExternalsProvider } from './externals/Context';
import { IExternals } from './externals/types';
import { Balance } from './pages/balance';
import { CV } from './pages/cv';
import { Main } from './pages/main';

type Props = { externals: IExternals };

export const PureApp: React.FC<Props> = ({ externals }) => {
  const darkMode = externals.options.getTheme() === 'dark';

  return (
    <App>
      <ConfigProvider
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <GlobalStyle />
        {darkMode && <GlobalDarkStyle />}
        <ExternalsProvider externals={externals}>
          <Switch>
            <Route path="/" component={Main} />
            <Route path="/balance" component={Balance} />
            <Route path="/cv" component={CV} />
          </Switch>
        </ExternalsProvider>
      </ConfigProvider>
    </App>
  );
};

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
    }

    body, html, #root, .ant-app {
        height: 100%;
    }
`;

const GlobalDarkStyle = createGlobalStyle`
    body {
        background: #000;
    }
`;
