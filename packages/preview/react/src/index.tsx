import './connect-devtools';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { externals } from './externals';
import { describe, it } from './factories';
import { App } from './App';
import {
  PresetGroup,
  StoryTree,
  UserClientConfig,
  UserPresetGroup,
} from './types';
import { PresetConfigName, PresetName } from '@storyshots/core';

export function createPreviewApp<TExternals>(
  config: UserClientConfig<TExternals>,
) {
  const { presets, ...restConfig } = config;

  return {
    describe: describe,
    it: it<TExternals>,
    run: (stories: StoryTree[]) => {
      ReactDOM.createRoot(createRootElement()).render(
        <App
          {...restConfig}
          presets={toTypedPreset(presets)}
          stories={stories}
          externals={externals}
        />,
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

function toTypedPreset<TExternals>(
  presets: UserPresetGroup<TExternals>[],
): PresetGroup<TExternals>[] {
  return presets.map((preset) => ({
    name: preset.name as PresetConfigName,
    default: preset.default as PresetName,
    additional: preset.additional.map((it) => ({
      name: it.name as PresetName,
      configure: it.configure,
    })),
  }));
}

export {
  createMobileDevice,
  createDesktopDevice,
} from './test-presets-factories';
export { finder } from './finder';
export type { Journal } from './journal/types';
