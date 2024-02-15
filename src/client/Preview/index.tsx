import React from 'react';
import ReactDOM from 'react-dom/client';
import { FinalClientConfig } from '../create-configure-client/types';
import { Preview } from './Preview';

export async function createPreviewApp(config: FinalClientConfig) {
  const div = document.createElement('div');

  div.setAttribute('id', 'root');

  document.body.appendChild(div);

  ReactDOM.createRoot(div).render(<Preview {...config} />);
}
