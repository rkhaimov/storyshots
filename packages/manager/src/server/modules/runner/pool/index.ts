import { isNil } from '@storyshots/core';
import { Runner } from '../types';
import { jobs } from './jobs';
import { Job, WorkerState } from './types';
import { workers } from './workers';

type PoolOptions = {
  agentsCount: number;
};

export function pool({ agentsCount }: PoolOptions): Runner {
  return {
    size: agentsCount,
    create: async () => {
      const _workers = await workers.create(agentsCount);
      const _jobs = jobs.create();

      return {
        schedule: (story, task) =>
          jobs.schedule(_jobs, story, task, () => lookout(_jobs, _workers)),
        close: () => workers.destroy(_workers),
      };
    },
  };
}

async function lookout(_jobs: Job[], _workers: WorkerState[]) {
  const free = workers.available(_workers);

  // There are no free workers
  if (isNil(free)) {
    return;
  }

  const job = jobs.available(_jobs);

  // There is no more job to do
  if (job === undefined) {
    return;
  }

  // Does the job while marking worker as busy and free it at the end
  await workers.handle(_workers, free, job);

  // Continue looking for a new job
  return lookout(_jobs, _workers);
}
