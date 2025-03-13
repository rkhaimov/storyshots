import { JournalRecord } from './journal/types';
import { PureStoryTree, StoryID } from './story';
import { Device } from './config';

export type PreviewState = {
  stories: PureStoryTree[];
};

export type ManagerState = {
  id?: StoryID;

  device: Device;

  testing: boolean;

  devices: Device[];
};

declare global {
  interface Window {
    onPreviewReady(
      getState: (config: ManagerState) => PreviewState,
    ): ManagerState;

    getJournalRecords(): JournalRecord[];
  }
}
