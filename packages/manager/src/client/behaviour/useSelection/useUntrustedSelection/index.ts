import { DeviceName, ScreenshotName, StoryID } from '@storyshots/core';
import { UntrustedPreviewConfig } from './types';
import { useURLPersistentSelection } from './useURLPersistentSelection';

export function useUntrustedSelection() {
  const [selection, setSelection] = useURLPersistentSelection();

  return {
    selection,
    setStory: (id: StoryID) =>
      setSelection({
        ...selection,
        type: 'story',
        id,
        selectedAt: Date.now(),
      }),
    setRecords: (id: StoryID, at: DeviceName) =>
      setSelection({ ...selection, type: 'records', id, device: at }),
    setScreenshot: (id: StoryID, name: ScreenshotName, at: DeviceName) =>
      setSelection({ ...selection, type: 'screenshot', id, name, device: at }),
    setConfig: (config: UntrustedPreviewConfig) =>
      setSelection({ ...selection, config }),
  };
}
