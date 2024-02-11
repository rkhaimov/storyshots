import { Configuration } from 'webpack';

export type ServerConfig = {
  clientEntry: string;
  recordsPath: string;
  screenshotsPath: string;
  tempPath: string;
  overrideWebpackConfig(config: Configuration): Configuration;
};
