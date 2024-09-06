import { StoryID, TestConfig } from '@storyshots/core';
import { createManagerRequest } from '../reusables/createManagerRequest';
import { ManagerConfig } from './reusables/types';

const _getHostUrl = (config: ManagerConfig) =>
  `http://localhost:${config.port}`;

export const getManagerHost = (config: ManagerConfig) =>
  createManagerRequest(_getHostUrl(config));

export const createPathToStory = (
  id: StoryID,
  test: TestConfig,
  config: ManagerConfig,
) =>
  createManagerRequest(
    `${_getHostUrl(config)}/chromium/${id}?config=${encodeURIComponent(
      JSON.stringify(test),
    )}`,
  );
