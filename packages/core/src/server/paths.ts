import { toManagerURL } from '../reusables/runner/toManagerURL';
import { Story } from './reusables/types';
import { ManagerConfig } from './types';

export const createManagerRootURL = (config: ManagerConfig) => {
  const url = new URL('http://localhost:6006');

  url.searchParams.set('size', `${config.runner.size}`);
  url.searchParams.set('devices', `${JSON.stringify(config.devices)}`);

  return toManagerURL(url);
};

export const createStoryURL = (story: Story, config: ManagerConfig) => {
  const url = createManagerRootURL(config);

  // TODO: Must be type related with config parsing functions
  url.searchParams.set('device', JSON.stringify(story.payload.device));
  url.pathname = `/chromium/${story.id}`;

  return url;
};
