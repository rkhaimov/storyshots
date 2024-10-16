import { JournalRecord } from './journal/types';
import { PureStoryTree, StoryID } from './story';
import { Device } from './test-config';

export type PreviewState = {
  retries: number;
  stories: PureStoryTree[];
  devices: Device[];
};

export type PreviewConfig = {
  id?: StoryID;
  device?: Device;
  screenshotting: boolean;
  emulated: boolean;
  key: string;
};

export interface Channel {
  state(preview: PreviewState): PreviewConfig;

  records(): JournalRecord[];
}
