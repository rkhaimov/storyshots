import { Application } from 'express-serve-static-core';
import { ManagerConfig } from '../../types';
import { Baseline } from '../reusables/baseline';
import { createTestResults } from './createTestResults';
import { parseStory } from './parseStory';

export async function createActServerSideHandler(
  app: Application,
  baseline: Baseline,
  config: ManagerConfig,
) {
  const runner = await config.runner.run();

  app.post('/api/server/act/:id', async (request, response) => {
    const story = parseStory(request);

    const result = await runner.allocate(story, (page) =>
      createTestResults({ story, config, baseline }, page),
    );

    return response.json(result);
  });

  return () => runner.close();
}
