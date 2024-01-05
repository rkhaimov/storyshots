import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import { Storyshots } from '../src/client';
import { stories } from './stories';

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
    <Storyshots stories={stories} />
  </>
);

ReactDOM.createRoot(div).render(<App />);
