import { PreviewConfig, PreviewState } from '@storyshots/core';

export type PreviewConnectionProps = {
  config: PreviewConfig;
  onStateChange(preview: PreviewState): void;
};
