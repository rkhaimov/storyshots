import { RequestHandler } from 'express';
import { Stabilizer } from '../modules/stabilizer';
import { ImageComparator } from '../modules/comparator';

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
  optimization: {
    agentsCount: number;
    retries: number;
    stabilize: Stabilizer;
  };
  compare: ImageComparator;
  devtools?: string;
};
