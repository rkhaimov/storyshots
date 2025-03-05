import { PureStory } from '@storyshots/core';
import { IWebDriver } from '../../../types';
import { driver } from '../../driver';
import { toStories } from '../../toStories';
import { RunConfig } from '../types';

export function createTests(config: RunConfig): Test[] {
  return toStories(config.stories)
    .flatMap((story) =>
      story.cases
        .filter((_case) => config.on.includes(_case.device))
        .map((_case) => [story, _case] as const),
    )
    .map(([story, _case]) => ({
      story,
      case: _case,
      run: () => driver.test(story.id, _case),
    }));
}

export type Test = {
  story: PureStory;
  case: PureStory['cases'][number];
  run(): ReturnType<IWebDriver['test']>;
};
