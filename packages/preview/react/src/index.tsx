import './connect-devtools';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { describe, it } from './factories';
import { Preview } from './Preview';
import { ClientConfig, StoryTree } from './types';

export function createPreviewApp<TExternals>(config: ClientConfig<TExternals>) {
  return {
    describe: describe,
    it: it<TExternals>,
    run: (stories: StoryTree[]) => {
      ReactDOM.createRoot(createRootElement()).render(
        <Preview {...config} stories={stories} />,
      );
    },
  };
}

function createRootElement(): Element {
  const found = document.querySelector('#root');

  if (found) {
    return found;
  }

  const div = document.createElement('div');

  div.setAttribute('id', 'root');

  document.body.appendChild(div);

  return div;
}

export {
  createMobileDevice,
  createDesktopDevice,
} from './test-presets-factories';
export { finder } from './finder';
export type { Journal } from './journal/types';
