import './connect-devtools';
import { assert } from '@storyshots/core';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { externals } from './externals';
import { describe, it } from './factories';
import { ClientConfig, StoryTree } from './types';

export function createPreviewApp<TExternals>(config: ClientConfig<TExternals>) {
  assert(
    config.devices.length > 0,
    'There should be at least one device defined',
  );

  assert(
    config.presets.every((it) => it.additional.length > 0),
    'Every preset should have at least two possible values. Additional can not be empty',
  );

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
