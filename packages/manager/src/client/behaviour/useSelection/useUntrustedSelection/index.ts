import { useEffect, useState } from 'react';
import { DeviceName, ScreenshotName, StoryID } from '@storyshots/core';
import { UntrustedPreviewConfig, UntrustedSelection } from './types';

export function useUntrustedSelection() {
  const [selection, setSelection] = usePersistentState();

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

function usePersistentState() {
  const [selection, setSelection] = useState((): UntrustedSelection => {
    const url = new URL(location.href);
    const last = url.searchParams.get('selection');

    if (last === null) {
      return {
        type: 'no-selection',
        config: {
          emulated: false,
        },
      };
    }

    return JSON.parse(last) as UntrustedSelection;
  });

  useEffect(() => {
    if (selection.type !== 'story') {
      return;
    }

    const url = new URL(location.href);

    url.searchParams.set('selection', JSON.stringify(selection));

    history.pushState(null, '', url);
  }, [selection]);

  return [selection, setSelection] as const;
}
