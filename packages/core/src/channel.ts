import { JournalRecord } from './journal/types';
import { PureStoryTree, StoryID } from './story';
import { Device, PresetGroup, SelectedPresets } from './test-config';

export type PreviewState = {
  retries: number;
  stories: PureStoryTree[];
  devices: Device[];
  presets: PresetGroup[];
};

export type ManagerState = {
  id?: StoryID;
  screenshotting: boolean;
  presets: SelectedPresets;
  device?: Device;
};

export interface Channel {
  state(preview: PreviewState): ManagerState;

  records(): JournalRecord[];
}
