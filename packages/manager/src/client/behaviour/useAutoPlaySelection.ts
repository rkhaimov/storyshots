import { useEffect, useState } from 'react';
import { WithPossibleError } from '../../reusables/types';
import { useDriver } from '../driver';
import { URLParsedParams } from './useBehaviourRouter';
import { usePreviewBuildHash } from './usePreviewBuildHash';
import {
  assertNotEmpty,
  createPreviewConnection,
  PreviewState,
  PureStory,
  ScreenshotName,
  SelectedPresets,
  TreeOP,
} from '@storyshots/core';

// TODO: Solve cancellation problem
export function useAutoPlaySelection(params: URLParsedParams) {
  const driver = useDriver();
  const hash = usePreviewBuildHash();

  const [selection, setSelection] = useState<AutoPlaySelection>({
    type: 'initializing',
  });

  useEffect(() => {
    selectAndPlay();
  }, [params, hash]);

  return {
    selection,
    identity: `${JSON.stringify(params)}_${hash}`,
  };

  async function selectAndPlay() {
    const config = await createPreviewConnection({
      id: params.type === 'no-selection' ? undefined : params.id,
      screenshotting: false,
      presets: params.type === 'story' ? params.presets : {},
    });

    if (params.type === 'no-selection') {
      return setSelection({
        type: 'no-selection',
        config,
        selectedPresets: params.presets,
      });
    }

    const story = TreeOP.find(config.stories, params.id);

    assertNotEmpty(story);

    if (params.type === 'records') {
      return setSelection({
        type: 'records',
        story,
        config,
        selectedPresets: params.presets,
      });
    }

    if (params.type === 'screenshot') {
      return setSelection({
        type: 'screenshot',
        story,
        config,
        name: params.name,
        selectedPresets: params.presets,
      });
    }

    setSelection({
      type: 'story',
      story,
      config,
      playing: true,
      selectedPresets: params.presets,
    });

    const result = await driver.actOnClientSide(story.payload.actions);

    setSelection({
      type: 'story',
      story,
      config,
      playing: false,
      result,
      selectedPresets: params.presets,
    });
  }
}

export type AutoPlaySelection =
  | {
      type: 'initializing';
    }
  | AutoPlaySelectionInitialized;

export type AutoPlaySelectionInitialized =
  | {
      type: 'no-selection';
      config: PreviewState;
      selectedPresets: SelectedPresets;
    }
  | {
      type: 'story';
      story: PureStory;
      config: PreviewState;
      playing: true;
      selectedPresets: SelectedPresets;
    }
  | {
      type: 'story';
      story: PureStory;
      config: PreviewState;
      playing: false;
      result: WithPossibleError<void>;
      selectedPresets: SelectedPresets;
    }
  | {
      type: 'records';
      story: PureStory;
      config: PreviewState;
      selectedPresets: SelectedPresets;
    }
  | {
      type: 'screenshot';
      name: ScreenshotName | undefined;
      story: PureStory;
      config: PreviewState;
      selectedPresets: SelectedPresets;
    };
