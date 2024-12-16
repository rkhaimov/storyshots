import { App, ConfigProvider, ThemeConfig } from 'antd';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch } from 'wouter';
import { ExternalsProvider } from './externals/Context';
import { IExternals } from './externals/types';
import { Balance } from './pages/balance';
import { CV } from './pages/cv';
import { Main } from './pages/main';

type Props = { externals: IExternals; theme?: ThemeConfig };

export const PureApp: React.FC<Props> = (props) => {
  return (
    <App>
      <ConfigProvider theme={props.theme}>
        <GlobalStyle />
        <ExternalsProvider externals={props.externals}>
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
