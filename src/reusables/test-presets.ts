import type { Device as PuppeteerDevice, Viewport } from 'puppeteer';

export type Device = ViewPortOnlyDeviceConfig | CompleteDeviceConfig;

export type ViewPortOnlyDeviceConfig = {
  type: 'viewport-only';
  name: string;
  viewport: Viewport;
};

export type CompleteDeviceConfig = {
  type: 'complete';
  name: string;
  config: PuppeteerDevice;
};

export type DevicePresets = {
  primary: Device;
  additional: Device[];
};

export type CustomPreset<TExternals> = {
  name: string;
  prepare: (externals: TExternals) => TExternals;
};

export type CustomPresetGroup<TExternals> = {
  name: string;
  primary: CustomPreset<TExternals>;
  additional: CustomPreset<TExternals>[];
};
