import React from 'react';
import { DevicePresets, IntermediateNode, LeafNode } from '@storyshots/core';
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

export type CustomPreset<TExternals> = {
  name: string;
  prepare(externals: TExternals): TExternals;
};

export type CustomPresetGroup<TExternals> = {
  name: string;
  default: CustomPreset<TExternals>;
  additional: CustomPreset<TExternals>[];
};
