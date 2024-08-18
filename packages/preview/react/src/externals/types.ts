import { Channel, ManagerState, PreviewState } from '@storyshots/core';

export interface IExternals {
  createManagerConnection(preview: PreviewState): ManagerState;

  setRecordsSource(records: Channel['records']): void;
}
