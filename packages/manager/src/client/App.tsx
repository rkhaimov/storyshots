import React from 'react';
import { Route, Switch } from 'wouter';

import { ForChromiumOnly } from './ForChromiumOnly';
import { Manager } from './Manager';
import { GlobalStyle } from './GlobalStyle';

export const App: React.FC = () => (
  <>
    <GlobalStyle />
    <Switch>
      <Route path="/chromium/:story" component={ForChromiumOnly} />
      <Route path="/" component={Manager} />
    </Switch>
  </>
);
