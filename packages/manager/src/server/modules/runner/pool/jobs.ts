import { Story } from '../../../reusables/types';
import { Task, TaskResult } from '../types';
import { Job } from './types';

export const jobs = {
  create: (): Job[] => [],
  schedule: (jobs: Job[], story: Story, task: Task, onScheduled: () => void) =>
    new Promise<TaskResult>((onDone) => {
      jobs.push({ story, task, onDone });

      onScheduled();
    }),
  available: (jobs: Job[]) => jobs.shift(),
};
