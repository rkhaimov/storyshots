import { JournalRecord } from './journal';
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

export function createPreviewConnection(
  manager: ManagerState,
): Promise<PreviewState> {
  return new Promise<PreviewState>(
    (resolve) =>
      ((window as never as Channel).state = (preview) => {
        resolve(preview);

        return manager;
      }),
  );
}

export function createManagerConnection(
  channel: Window,
  preview: PreviewState,
): ManagerState {
  return (channel as unknown as Channel).state(preview);
}

export function setRecords(getter: () => JournalRecord[]): void {
  (window as never as Channel).records = getter;
}

export interface Channel {
  state(preview: PreviewState): ManagerState;

  records(): import('./journal').JournalRecord[];
}
