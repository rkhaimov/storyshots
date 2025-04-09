import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const div = document.createElement('div');

div.setAttribute('id', 'root');

document.body.appendChild(div);

createRoot(div).render(<App />);
