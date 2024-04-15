import {
  Actor,
  Device,
  IntermediateNode,
  Journal,
  LeafNode,
  PresetName,
} from '@storyshots/core';
import React from 'react';
import { IExternals } from './externals/types';

export type StoryTree = Group | Story;

export type Group = IntermediateNode<
  {
    title: string;
  },
  Story['payload']
>;

export type Story<TExternals = unknown> = LeafNode<{
  title: string;
  arrange(externals: TExternals, journal: Journal, device: Device): TExternals;
  act(actor: Actor, device: Device): Actor;
  render(externals: TExternals, screenshotting: boolean): React.ReactNode;
}>;

type UserDefinedDevice = Omit<Device, 'name'> & { name: string };

export type ClientConfig<TExternals> = {
  devices: UserDefinedDevice[];
  presets: UserDefinedPresetGroup<TExternals>[];
  createExternals(): TExternals;
  createJournalExternals(externals: TExternals, journal: Journal): TExternals;
};

export type Props = ClientConfig<unknown> & {
  stories: StoryTree[];
  externals: IExternals;
};

export type Preset<TExternals> = {
  name: PresetName;
  configure(externals: TExternals): TExternals;
};

export type UserDefinedPreset<TExternals> = {
  name: string;
  configure(externals: TExternals): TExternals;
};

export type UserDefinedPresetGroup<TExternals> = {
  name: string;
  default: string;
  additional: UserDefinedPreset<TExternals>[];
};
