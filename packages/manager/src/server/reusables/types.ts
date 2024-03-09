import { Configuration } from 'webpack';

export type ServerConfig = {
  previewEntry: string;
  recordsPath: string;
  screenshotsPath: string;
  tempDirPath: string;
  overridePreviewBuildConfig(config: Configuration): Configuration;
};
