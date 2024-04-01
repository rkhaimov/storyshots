import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { externals } from './externals';

const div = document.createElement('div');

div.setAttribute('id', 'root');

document.body.appendChild(div);

ReactDOM.createRoot(div).render(<App externals={externals} />);
