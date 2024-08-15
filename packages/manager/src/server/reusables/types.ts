import { ActionMeta } from '@storyshots/core';
import { RequestHandler } from 'express';
import { Stabilizer } from '../handlers/createActServerSideHandler';

export type PreviewServe = {
  // Handler must provide all requested static contents
  handler: RequestHandler;
  // Handle must be called each time source code of preview changes
  // Handle must be called only after new sources are compiled and accessible
  // Hot must be set to true when state is preserved between updates
  onUpdate(handle: (hash: string, hot: boolean) => void): void;
};

export type ServerConfig = {
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
  devtools: string;
};

export type ScreenshotAction = Extract<ActionMeta, { action: 'screenshot' }>;
