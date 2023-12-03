import { createGlobalStyle } from 'styled-components';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { Manager } from './Manager';
import { externals } from '../externals/externals';
import { Route, Switch } from 'wouter';
import { ExternalsProvider } from '../externals/Context';
import { ForChromiumOnly } from './ForChromiumOnly';

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

const App = () => (
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

ReactDOM.createRoot(div).render(<App />);
