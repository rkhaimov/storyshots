import { runPreviewCompilation } from './compiler/runPreviewCompilation';
import { runManagerCompilation } from './compiler/runManagerCompilation';
import { ServerConfig } from './reusables/types';

export function run(config: ServerConfig) {
  runPreviewCompilation(config, runManagerCompilation(config));
}
