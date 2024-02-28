import React from 'react';
import { TestPresets } from '../../reusables/test-presets';
import { IntermediateNode, LeafNode } from '../../reusables/tree';
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
  devices: TestPresets;
  createExternals(): TExternals;
  createJournalExternals(externals: TExternals, journal: Journal): TExternals;
  renderScreenshotTimeEnv(app: React.ReactNode): React.ReactNode;
};

export type Props = ClientConfig<unknown> & {
  stories: StoryTree[];
};