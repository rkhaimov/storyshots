import React from 'react';
import { DevicePresets, IntermediateNode, LeafNode } from '@storyshots/core';
import { Actor } from './actor/types';
import { IExternals } from './externals/types';
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
  arrange(
    externals: TExternals,
    journal: Journal,
    screenshotting: boolean,
  ): TExternals;
  act(actor: Actor): Actor;
  render(externals: TExternals, screenshotting: boolean): React.ReactNode;
}>;

export type ClientConfig<TExternals> = {
  devices: DevicePresets;
  presets: CustomPresetGroup<TExternals>[];
  createExternals(): TExternals;
  createJournalExternals(externals: TExternals, journal: Journal): TExternals;
};

export type Props = ClientConfig<unknown> & {
  stories: StoryTree[];
  externals: IExternals;
};

export type CustomPreset<TExternals> = {
  name: string;
  configure(externals: TExternals): TExternals;
};

export type CustomPresetGroup<TExternals> = {
  name: string;
  default: string;
  additional: CustomPreset<TExternals>[];
};
