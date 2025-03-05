import { Brand, ManagerState, PreviewState } from '@storyshots/core';

export type PreviewBuildHash = Brand<string, 'PreviewBuildHash'> | undefined;

export type PreviewConnectionProps = {
  state: ManagerState;
  onPreviewLoaded(preview: PreviewState, hash: PreviewBuildHash): void;
};
