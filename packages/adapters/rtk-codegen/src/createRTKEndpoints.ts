import { generateEndpoints } from '@rtk-query/codegen-openapi';
import { Settings } from './types';

export async function createRTKEndpoints(settings: Settings) {
  return {
    file: settings.outputFile,
    code: (await generateEndpoints({
      ...settings,
      outputFile: undefined,
    })) as string,
  };
}
