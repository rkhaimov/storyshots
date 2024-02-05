import { runPreviewCompilation } from './compiler/runPreviewCompilation';
import { runManagerCompilation } from './compiler/runManagerCompilation';

export function run() {
  runPreviewCompilation(runManagerCompilation());
}
