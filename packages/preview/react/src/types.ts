import {
  Actor,
  Device,
  IntermediateNode,
  JournalStoryConfig,
  LeafNode,
  StoryConfig,
} from '@storyshots/core';
import React from 'react';

export type StoryTree = Group | Story;

export type Group = IntermediateNode<
  {
    title: string;
  },
  Story['payload']
>;

export type Story<TExternals = unknown> = LeafNode<{
  title: string;
  arrange(externals: TExternals, config: JournalStoryConfig): TExternals;
  act(actor: Actor, config: StoryConfig): Actor;
  render(externals: TExternals, config: StoryConfig): React.ReactNode;
}>;

type UserDefinedDevice = Omit<Device, 'name'> & { name: string };

export type ClientConfig<TExternals> = {
  devices: UserDefinedDevice[];
  createExternals(config: StoryConfig): TExternals;
  createJournalExternals(
    externals: TExternals,
    config: JournalStoryConfig,
  ): TExternals;
};

export type PreviewProps = ClientConfig<unknown> & {
  stories: StoryTree[];
};
