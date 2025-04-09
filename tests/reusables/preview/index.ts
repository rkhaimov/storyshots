import fs from 'fs';
import { Actor, createActor } from '../actor';
import { TestDescription, withPreviewStep } from '../test/test-description';

import { createCode } from './code';
import {
  createDefaultExternalsFactory,
  CreateExternalsFactory,
} from './externals';
import {
  createDefaultStoriesFactory,
  CreateStories,
  CreateStory,
  fromStoriesFactory,
  fromStoryFactory,
} from './stories';

export type Preview<T> = {
  externals<R>(factory: CreateExternalsFactory<R>): Preview<R>;
  stories(factory: CreateStories<T>): Preview<T>;
  story(factory: CreateStory<T>): Preview<T>;
  actor(): Actor<T>;
};

export function createPreview(description: TestDescription) {
  let externals = createDefaultExternalsFactory();
  let stories = createDefaultStoriesFactory();

  const preview: Preview<unknown> = {
    externals: (factory) => {
      externals = factory;

      return preview as never;
    },
    stories: (factory) => {
      stories = fromStoriesFactory(factory);

      return preview;
    },
    story: (factory) => {
      stories = fromStoryFactory(factory);

      return preview;
    },
    actor: () =>
      createActor(
        withPreviewStep(description, async (_, tf) =>
          fs.writeFileSync(tf('index.tsx'), createCode(externals, stories)),
        ),
      ),
  };

  return preview;
}
