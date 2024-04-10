import {
  PresetConfigName,
  PresetName,
  PurePresetGroup,
  PureStoryTree,
  StoryID,
} from './story';
import { DevicePresets } from './test-presets';
import { JournalRecord } from './journal';

export type SelectedPresets = null | {
  [key: PresetConfigName]: PresetName;
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

  records(): JournalRecord[];
}
