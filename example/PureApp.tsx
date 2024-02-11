import React from 'react';
import { App } from 'antd';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch } from 'wouter';
import { ExternalsProvider } from './externals/Context';
import { IExternals } from './externals/types';
import { Balance } from './pages/balance';
import { CV } from './pages/cv';
import { Main } from './pages/main';

type Props = { externals: IExternals };

export const PureApp: React.FC<Props> = ({ externals }) => (
  <App>
    <GlobalStyle />
    <ExternalsProvider externals={externals}>
      <Switch>
        <Route path="/" component={Main} />
        <Route path="/balance" component={Balance} />
        <Route path="/cv" component={CV} />
      </Switch>
    </ExternalsProvider>
  </App>
);

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
    }

    body, html, #root, .ant-app {
        height: 100%;
    }
`;
