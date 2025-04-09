import { runUI } from '@storyshots/core/manager';
import { createConfig } from './config';

void createConfig().then(runUI);
