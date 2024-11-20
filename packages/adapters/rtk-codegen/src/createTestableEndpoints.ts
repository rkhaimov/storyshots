import { generate } from './generate';
import { parse } from './parse';
import { createRTKEndpoints } from './createRTKEndpoints';
import { Settings } from './types';

export async function createTestableEndpoints(
  name: string,
  settings: Settings,
): Promise<Record<string, string>> {
  const rtk = await createRTKEndpoints(settings);
  const testing = generate(name, settings, parse(rtk.code));

  return {
    [rtk.file]: rtk.code,
    [testing.file]: testing.code,
  };
}
