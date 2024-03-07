type SelectedPresets = {
  [key: string]: string;
};

type ManagerState = {
  id?: import('./story').StoryID;
  screenshotting: boolean;
  selectedPresets: SelectedPresets;
};

interface Window {
  setAppConfigAndGetState(
    stories: import('./story').PureStoryTree[],
    devices: import('./test-presets').DevicePresets,
    presets: import('./test-presets').CustomPresetGroup[],
  ): ManagerState;

  readJournalRecords(): import('./journal').JournalRecord[];
}
