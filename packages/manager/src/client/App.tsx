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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        font-size: 14px;
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
