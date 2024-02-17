import React from 'react';
import { Journal, StoryTree } from '../types';
import { Device } from '../../reusables/types';

export type Devices = {
  primary: Device;
  additional: Device[];
};

export type ClientConfig<TExternals> = {
  devices: Devices;
  createExternals(): TExternals;
  createJournalExternals(externals: TExternals, journal: Journal): TExternals;
  renderScreenshotTimeEnv(app: React.ReactNode): React.ReactNode;
};

export type FinalClientConfig = ClientConfig<unknown> & {
  stories: StoryTree[];
};
