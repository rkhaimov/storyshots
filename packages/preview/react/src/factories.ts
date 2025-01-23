import { createActor, TreeOP } from '@storyshots/core';
import { Group, Story } from './types';

export function describe(title: string, children: Group['children']): Group {
  return TreeOP.createIntermediateNode(title, { title }, children);
}

type StoryConfig<TExternals> = {
  render: Story<TExternals>['payload']['render'];
  retries?: Story<TExternals>['payload']['retries'];
  arrange?: Story<TExternals>['payload']['arrange'];
  act?: Story<TExternals>['payload']['act'];
};

export function it<TExternals>(
  title: string,
  config: StoryConfig<TExternals>,
): Story<TExternals> {
  return TreeOP.createLeafNode(title, {
    title,
    render: config.render,
    act: config.act ?? (() => createActor()),
    arrange: config.arrange ?? ((externals) => externals),
    retries: config.retries ?? (() => 0),
  });
}
