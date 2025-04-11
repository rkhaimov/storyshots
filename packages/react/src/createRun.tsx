import { StoryTree } from '@storyshots/core';
import { createStoryView } from './App';
import { ExternalsFactory } from './types';

export const createRun =
  <TExternals extends unknown>(factory: ExternalsFactory<TExternals>) =>
  async (stories: StoryTree) => {
    try {
      const { createRoot } = await import(/* webpackIgnore: true */ 'react-dom/client');

      createRoot(createRootElement()).render(createStoryView(stories, factory));
    } catch (_) {
      const ReactDOM = await import('react-dom');

      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(createStoryView(stories, factory), createRootElement());
    }
  };

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
