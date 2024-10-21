import './connect-devtools';
import { assert } from '@storyshots/core';

import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { describe, it } from './factories';
import { ClientConfig, StoryTree } from './types';

export function createPreviewApp<TExternals>(config: ClientConfig<TExternals>) {
  assert(
    config.devices.length > 0,
    'There should be at least one device defined',
  );

  return {
    describe: describe,
    it: it<TExternals>,
    run: (stories: StoryTree[]) => {
      ReactDOM.render(
        <App {...config} stories={stories} />,
        createRootElement(),
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
