import { Brand } from './brand';
import { Journal } from './journal/types';

export type StoryConfig = TestConfig & { screenshotting: boolean };

export type JournalStoryConfig = StoryConfig & { journal: Journal };

export type TestConfig = {
  device: Device;
  presets: SelectedPresets;
};

export type DeviceName = Brand<string, 'DeviceName'>;

export type Device = SizeOnly | Emulated;

export type SizeOnly = {
  type: 'size-only';
  name: DeviceName;
  config: {
    width: number;
    height: number;
    deviceScaleFactor?: number;
  };
};

export type Emulated = {
  type: 'emulated';
  name: DeviceName;
  config: {
    userAgent: string;
    width: number;
    height: number;
    deviceScaleFactor?: number;
    isLandscape?: boolean;
  };
};

export type PresetGroup = {
  name: PresetConfigName;
  default: PresetName;
  others: PresetName[];
};

export type PresetConfigName = Brand<string, 'PresetConfigName'>;

export type PresetName = Brand<string, 'PresetName'>;

export type SelectedPresets = Record<string, string>;
