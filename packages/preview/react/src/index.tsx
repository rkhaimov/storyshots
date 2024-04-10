import './connect-devtools';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { externals } from './externals';
import { describe, it } from './factories';
import { ClientConfig, StoryTree } from './types';

export function createPreviewApp<TExternals>(config: ClientConfig<TExternals>) {
  return {
    describe: describe,
    it: it<TExternals>,
    run: (stories: StoryTree[]) => {
      ReactDOM.createRoot(createRootElement()).render(
        <App {...config} stories={stories} externals={externals} />,
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
export type { ActorTransformer } from './actor/types';
