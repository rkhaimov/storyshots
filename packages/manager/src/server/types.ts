import { RequestHandler } from 'express';
import { Capture } from './modules/capture';
import { ImageComparator } from './modules/compare';
import { Runner } from './modules/runner/types';

export type PreviewServe = {
  // Handler must provide all requested static contents
  handler: RequestHandler;
  // Handle must be called each time source code of preview changes
  // Handle must be called only after new sources are compiled and accessible
  onUpdate(handle: (hash: string) => void): void;
};

export type ManagerConfig = {
  paths: {
    records: string;
    screenshots: string;
    temp: string;
  };
  preview: PreviewServe;
  runner: Runner;
  capture: Capture;
  compare: ImageComparator;
  devtools?: string;
};
