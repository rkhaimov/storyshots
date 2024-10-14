import { PreviewConfig, PreviewState } from '@storyshots/core';

export type PreviewFrameProps = {
  config: PreviewConfig;
  onStateChange(preview: PreviewState): void;
};
