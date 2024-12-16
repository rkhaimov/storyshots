import React from 'react';
import { createRoot } from 'react-dom/client';
import { PureApp } from './PureApp';

const root = window.document.createElement('div');

document.body.appendChild(root);

createRoot(root).render(<PureApp />);
