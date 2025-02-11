import { DeviceName, isNil, ScreenshotName, StoryID } from '@storyshots/core';
import { useMemo } from 'react';
import { useSearchParams } from 'wouter';

/**
 * Manages user selection by persisting them between page reloads
 */
export function useUserSelection() {
  const [params, setParams] = useSearchParams();

  return {
    selection: useSelection(),
    setStory: (id: StoryID) =>
      setSelection({
        type: 'story',
        id,
        selectedAt: Date.now(),
      }),
    setRecords: (id: StoryID, at: DeviceName) =>
      setSelection({ type: 'records', id, device: at }),
    setScreenshot: (id: StoryID, name: ScreenshotName, at: DeviceName) =>
      setSelection({ type: 'screenshot', id, name, device: at }),
  };

  function useSelection() {
    const selection = params.get('selection');

    return useMemo((): UserSelection => {
      if (isNil(selection)) {
        return { type: 'no-selection' };
      }

      return JSON.parse(selection) as UserSelection;
    }, [selection]);
  }

  function setSelection(selection: UserSelection) {
    setParams((prev) => {
      prev.set('selection', JSON.stringify(selection));

      return prev;
    });
  }
}

export type UserSelection =
  | {
      type: 'no-selection';
    }
  | { type: 'story'; id: StoryID; selectedAt: number }
  | {
      type: 'records';
      id: StoryID;
      device: DeviceName;
    }
  | {
      type: 'screenshot';
      id: StoryID;
      name: ScreenshotName;
      device: DeviceName;
    };
