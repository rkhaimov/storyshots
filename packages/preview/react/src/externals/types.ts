import { ManagerState, PreviewState, Channel } from '@storyshots/core';

export interface IExternals {
  createManagerConnection(preview: PreviewState): ManagerState;

  setRecordsSource(records: Channel['records']): void;
}
