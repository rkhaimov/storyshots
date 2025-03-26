import { Device } from '@core';
import { RequestHandler } from 'express';
import { Capture } from './modules/capture';
import { ImageComparator } from './modules/compare';

import { Runner } from './modules/runner/types';

export interface IPreviewServer {
  handler: RequestHandler;

  onUpdate(handle: (hash: string) => void): void;

  cleanup(): Promise<unknown>;
}

export type ManagerConfig = {
  paths: {
    records: string;
    screenshots: string;
    temp: string;
  };
  devices: UserDefinedDevice[];
  preview: IPreviewServer;
  runner: Runner;
  capture: Capture;
  compare: ImageComparator;
  devtools?: string;
};

type UserDefinedDevice = Omit<Device, 'name'> & { name: string };
