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
      const div = document.createElement('div');

      div.setAttribute('id', 'root');

      document.body.appendChild(div);

      ReactDOM.createRoot(div).render(
        <Preview {...config} stories={stories} />,
      );
    },
  };
}

export {
  createMobileDevice,
  createDesktopDevice,
} from './test-presets-factories';
export { finder } from './finder';
export type { Journal } from './journal/types';
