import { ActionMeta } from '@storyshots/core';
import { RequestHandler } from 'express';
import { Stabilizer } from '../handlers/createActServerSideHandler';

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
    stabilize: Stabilizer;
  };
  devtools?: string;
  port: number;
};

export type ScreenshotAction = Extract<ActionMeta, { action: 'screenshot' }>;
