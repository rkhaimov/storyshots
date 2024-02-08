import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch } from 'wouter';
import { ExternalsProvider } from './externals/Context';
import { IExternals } from './externals/types';
import { Balance } from './pages/balance';
import { CV } from './pages/cv';
import { Main } from './pages/main';

type Props = { externals: IExternals };

export const PureApp: React.FC<Props> = ({ externals }) => (
  <>
    <GlobalStyle />
    <ExternalsProvider externals={externals}>
      <Switch>
        <Route path="/" component={Main} />
        <Route path="/balance" component={Balance} />
        <Route path="/cv" component={CV} />
      </Switch>
    </ExternalsProvider>
  </>
);

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
    }

    body, html, #root {
        height: 100%;
    }
`;
