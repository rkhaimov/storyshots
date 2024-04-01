import { ManagerState, PreviewState } from '@storyshots/core';

export interface IExternals {
  createManagerConnection(preview: PreviewState): ManagerState;
}
