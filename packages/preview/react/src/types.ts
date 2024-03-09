import React from 'react';
import {
  CustomPresetGroup,
  DevicePresets,
  IntermediateNode,
  LeafNode,
} from '@storyshots/core';
import { Actor } from './actor/types';
import { Journal } from './journal/types';

export type StoryTree = Group | Story;

export type Group = IntermediateNode<
  {
    title: string;
  },
  Story['payload']
>;

export type Story<TExternals = unknown> = LeafNode<{
  title: string;
  arrange(externals: TExternals, journal: Journal): TExternals;
  act(actor: Actor): Actor;
  render(externals: TExternals): React.ReactNode;
}>;

export type ClientConfig<TExternals> = {
  devices: DevicePresets;
  presets: CustomPresetGroup<TExternals>[];
  createExternals(): TExternals;
  createJournalExternals(externals: TExternals, journal: Journal): TExternals;
  renderScreenshotTimeEnv(app: React.ReactNode): React.ReactNode;
};

export type Props = ClientConfig<unknown> & {
  stories: StoryTree[];
};
