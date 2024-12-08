import { Settings } from '../types';
import path from 'path';

export function createTestableEndpointsFileName(settings: Settings) {
  const ext = path.extname(settings.outputFile);

  return settings.outputFile.replace(ext, `.storyshots${ext}`);
}
