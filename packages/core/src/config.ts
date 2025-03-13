import { Brand } from './brand';
import { Journal } from './journal/types';

export type StoryConfig = {
  device: Device;
  journal: Journal;
  testing: boolean;
};

export type DeviceName = Brand<string, 'DeviceName'>;

export type Device = {
  name: DeviceName;
  width: number;
  height: number;
  deviceScaleFactor?: number;
  userAgent?: string;
};
