import { Actor, createActor, Device, StoryConfig } from '@storyshots/core';
import React from 'react';

export function it<TExternals>(
  title: string,
  config: StoryPayload<TExternals>,
): Story<TExternals> {
  return {
    type: 'story',
    title,
    payload: {
      render: config.render,
      act: config.act ?? (() => createActor()),
      arrange: config.arrange ?? ((externals) => externals),
      retries: config.retries ?? (() => 0),
    },
  };
}

type StoryPayload<TExternals> = {
  retries?(device: Device): number;
  arrange?(externals: TExternals, config: StoryConfig): TExternals;
  act?(actor: Actor, device: Device): Actor;
  render(externals: TExternals, config: StoryConfig): React.ReactNode;
};

export type Story<TExternals = unknown> = {
  type: 'story';
  title: string;
  payload: Required<StoryPayload<TExternals>>;
};
