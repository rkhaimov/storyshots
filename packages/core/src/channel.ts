import { PurePresetGroup, PureStoryTree, StoryID } from './story';
import { DevicePresets } from './test-presets';

export type SelectedPresets = null | {
  [key: string]: string;
};

export type PreviewState = {
  stories: PureStoryTree[];
  devices: DevicePresets;
  presets: PurePresetGroup[];
};

export type ManagerState = {
  id?: StoryID;
  screenshotting: boolean;
  presets: SelectedPresets;
};

export interface Channel {
  state(preview: PreviewState): ManagerState;

  records(): import('./journal').JournalRecord[];
}
