import { Router } from 'express';
import { ManagerConfig } from '../../types';
import { Baseline } from '../reusables/baseline';
import { createTestResults } from './createTestResults';
import { parseStory } from './parseStory';

export async function createActServerSideHandler(
  router: Router,
  baseline: Baseline,
  config: ManagerConfig,
) {
  const runner = await config.runner.create();

  router.post('/api/server/act/:id', async (request, response) => {
    const story = parseStory(request);

    const result = await runner.schedule(story, (page) =>
      createTestResults({ story, config, baseline }, page),
    );

    return response.json(result);
  });

  return () => runner.close();
}
