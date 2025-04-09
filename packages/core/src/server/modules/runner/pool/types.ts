import { Page } from 'playwright';
import { Story } from '../../../reusables/types';
import { Task, TaskResult } from '../types';

export type Worker = {
  allocate(story: Story): Promise<AllocatedResource>;
  destroy(): Promise<void>;
};

export type AllocatedResource = { page: Page; cleanup(): Promise<void> };

export type WorkerState = FreeWorker | BusyWorker;

export type FreeWorker = {
  type: 'free';
  instance: Worker;
};

export type BusyWorker = {
  type: 'busy';
  instance: Worker;
};

export type Job = {
  story: Story;
  task: Task;
  onDone(result: TaskResult): void;
};
