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
