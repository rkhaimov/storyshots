import { StoryID, TestConfig } from '@storyshots/core';
import { ManagerConfig } from './types';

export const createManagerRootURL = (config: ManagerConfig) => {
  const url = new URL('http://localhost:6006');

  url.searchParams.set('manager', 'SECRET');
  url.searchParams.set('size', `${config.runner.size}`);

  return url;
};

export const createStoryURL = (id: StoryID, test: TestConfig, config: ManagerConfig) => {
  const url = createManagerRootURL(config);

  url.pathname = `/chromium/${id}`;
  url.searchParams.set('config', JSON.stringify(test));

  return url;
};
