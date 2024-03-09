import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch } from 'wouter';
import { DriverProvider } from './driver';
import { driver } from './driver/driver';
import { ForChromiumOnly } from './ForChromiumOnly';
import { Manager } from './Manager';

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
    <DriverProvider driver={driver}>
      <Switch>
        <Route path="/chromium/:story" component={ForChromiumOnly} />
        <Route path="/:story?" component={Manager} />
      </Switch>
    </DriverProvider>
  </>
);

ReactDOM.createRoot(div).render(<App />);
