import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { externals } from './externals';

const div = document.createElement('div');

div.setAttribute('id', 'root');

document.body.appendChild(div);

ReactDOM.render(<App externals={externals} />, div);
