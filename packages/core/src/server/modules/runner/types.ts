import { Page } from 'playwright';
import { TestRunResult } from '../../../reusables/runner/types';
import { WithPossibleError } from '../../../reusables/types';
import { Story } from '../../reusables/types';

export type Runner = {
  size: number;
  create(): Promise<RunnerInstance>;
};

type RunnerInstance = {
  schedule(story: Story, task: Task): Promise<TaskResult>;
  close(): Promise<unknown>;
};

export type Task = (page: Page) => Promise<TaskResult>;

export type TaskResult = WithPossibleError<TestRunResult>;
