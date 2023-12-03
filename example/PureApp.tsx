import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useLocation } from 'wouter';
import React from 'react';
import { Counter } from './counter';
import { IExternals } from './externals/types';
import { ExternalsProvider } from './externals/Context';

type Props = { externals: IExternals };

export const PureApp: React.FC<Props> = ({ externals }) => (
  <>
    <GlobalStyle />
    <ExternalsProvider externals={externals}>
      <Switch>
        <Route
          path="/"
          component={() => {
            const [, navigate] = useLocation();

            return (
              <button onClick={() => navigate('/counter')}>
                Open counter example
              </button>
            );
          }}
        />
        <Route path="/counter" component={Counter} />
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
