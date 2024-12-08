import { createRTKEndpoints } from './createRTKEndpoints';
import { generate } from './generate';
import { parse } from './parse';
import { Settings } from './types';

export async function createTestableEndpoints(
  name: string,
  settings: Settings,
): Promise<Record<string, string>> {
  const rtk = await createRTKEndpoints(settings);
  const meta = parse(rtk.code);
  const testing = generate(name, settings, meta);

  return {
    [rtk.file]: rtk.code,
    [testing.file]: testing.code,
  };
}
