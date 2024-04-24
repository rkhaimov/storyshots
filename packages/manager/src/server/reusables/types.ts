import { ActionMeta } from '@storyshots/core';
import { Application } from 'express-serve-static-core';

export type Compiler = {
  // Bundler must put its content under managers root (lib/preview)
  // Bundler must serve its own content on every url starting with /preview
  handle(server: Application): void;
  // Handler must be called each time source code of preview changes
  // Handler must be called only after new sources are compiled and accessible
  // Hot must be set to true when state is preserved between updates
  onUpdate(handler: (hash: string, hot: boolean) => void): void;
};

export type PreviewBundler = (config: ServerConfig) => Compiler;

export type ServerConfig = {
  paths: {
    preview: string;
    records: string;
    screenshots: string;
    temp: string;
  };
  bundler: PreviewBundler;
  devtools: string;
};

export type ScreenshotAction = Extract<ActionMeta, { action: 'screenshot' }>;