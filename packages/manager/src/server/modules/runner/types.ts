import { Page } from 'playwright';
import { Story } from '../../reusables/types';

export type Runner = {
  agentsCount: number;
  run(): Promise<RunnerInstance>;
};

type RunnerInstance = {
  allocate<T>(story: Story, task: (page: Page) => Promise<T>): Promise<T>;
  busy(): boolean;
  close(): void;
};
