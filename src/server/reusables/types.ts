import { Configuration } from 'webpack';

export type ServerConfig = {
  clientEntry: string;
  recordsPath: string;
  screenshotsPath: string;
  tempDirPath: string;
  overrideWebpackConfig(config: Configuration): Configuration;
};
