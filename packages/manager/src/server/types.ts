import { Device } from '@storyshots/core';
import { RequestHandler } from 'express';
import { Capture } from './modules/capture';
import { ImageComparator } from './modules/compare';

import { Runner } from './modules/runner/types';

export type PreviewServer = {
  // Handler must provide all requested static contents
  handler: RequestHandler;
  // Handle must be called each time source code of preview changes
  // Handle must be called only after new sources are compiled and accessible
  onUpdate(handle: (hash: string) => void): void;
  // Handler must define cleanup logic when server is being closed
  cleanup(): Promise<unknown>;
};

export type ManagerConfig = {
  paths: {
    records: string;
    screenshots: string;
    temp: string;
  };
  devices: UserDefinedDevice[];
  preview: PreviewServer;
  runner: Runner;
  capture: Capture;
  compare: ImageComparator;
  devtools?: string;
};

type UserDefinedDevice = Omit<Device, 'name'> & { name: string };
