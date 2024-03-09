import webpack from 'webpack';
import { config } from './src/server/compiler/manager-config';

webpack(config).run((error) => console.log(error));
