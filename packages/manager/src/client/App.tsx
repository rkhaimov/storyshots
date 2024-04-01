import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch } from 'wouter';

import { ExternalsProvider } from './externals/context';
import { IExternals } from './externals/types';
import { ForChromiumOnly } from './ForChromiumOnly';
import { Manager } from './Manager';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
    }

    body, html, #root {
        height: 100%;
    }
`;

type Props = {
  externals: IExternals;
};

export const App: React.FC<Props> = ({ externals }) => (
  <>
    <GlobalStyle />
    <ExternalsProvider externals={externals}>
      <Switch>
        <Route path="/chromium/:story" component={ForChromiumOnly} />
        <Route path="/:story?" component={Manager} />
      </Switch>
    </ExternalsProvider>
  </>
);
