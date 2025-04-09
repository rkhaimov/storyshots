import { actor, Device, flat, Story } from '@core';
import { IWebDriver } from '../../../types';
import { driver } from '../../driver';
import { RunConfig } from '../types';

export function createTests(config: RunConfig): Test[] {
  return flat(config.stories)
    .flatMap((story) =>
      config.on.map((device) => ({
        story,
        device,
        actions: story.act(actor, device).__toMeta(),
      })),
    )
    .filter(({ actions }) => actions.length > 0)
    .map(({ story, device, actions }) => ({
      story,
      device,
      run: () => driver.test(story.id, { device, actions }),
    }));
}

export type Test = {
  story: Story;
  device: Device;
  run(): ReturnType<IWebDriver['test']>;
};
