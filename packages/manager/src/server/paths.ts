import { StoryID, TestConfig } from '@storyshots/core';

export const createManagerRootURL = () => {
  const url = new URL('http://localhost:6006');

  url.searchParams.set('manager', 'SECRET');

  return url;
};

export const createStoryURL = (id: StoryID, test: TestConfig) => {
  const url = createManagerRootURL();

  url.pathname = `/chromium/${id}`;
  url.searchParams.set('config', JSON.stringify(test));

  return url;
};
