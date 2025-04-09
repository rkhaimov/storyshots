import { runInBackground } from '@storyshots/core/manager';
import { createConfig } from './config';

void createConfig().then(runInBackground);
