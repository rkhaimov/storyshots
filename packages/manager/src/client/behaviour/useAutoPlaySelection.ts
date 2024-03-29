import {
  assertNotEmpty,
  PreviewState,
  PureStory,
  ScreenshotName,
  SelectedPresets,
  TreeOP,
} from '@storyshots/core';
import { useEffect, useState } from 'react';
import { WithPossibleError } from '../../reusables/types';

import { useExternals } from '../externals/context';
import { URLParsedParams } from './useBehaviourRouter';

// TODO: Solve cancellation problem
export function useAutoPlaySelection(params: URLParsedParams) {
  const { driver, preview } = useExternals();
  const hash = preview.usePreviewBuildHash();

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
    const config = await preview.createPreviewConnection({
      id: params.type === 'no-selection' ? undefined : params.id,
      screenshotting: false,
      presets: params.type === 'story' ? params.presets : {},
    });

    if (params.type === 'no-selection') {
      return setSelection({
        type: 'no-selection',
        config,
        presets: params.presets,
      });
    }

    const story = TreeOP.find(config.stories, params.id);

    assertNotEmpty(story);

    if (params.type === 'records') {
      return setSelection({
        type: 'records',
        story,
        config,
        presets: params.presets,
      });
    }

    if (params.type === 'screenshot') {
      return setSelection({
        type: 'screenshot',
        story,
        config,
        name: params.name,
        presets: params.presets,
      });
    }

    setSelection({
      type: 'story',
      story,
      config,
      playing: true,
      presets: params.presets,
    });

    const result = await driver.actOnClientSide(story.payload.actions);

    setSelection({
      type: 'story',
      story,
      config,
      playing: false,
      result,
      presets: params.presets,
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
      presets: SelectedPresets;
    }
  | {
      type: 'story';
      story: PureStory;
      config: PreviewState;
      playing: true;
      presets: SelectedPresets;
    }
  | {
      type: 'story';
      story: PureStory;
      config: PreviewState;
      playing: false;
      result: WithPossibleError<void>;
      presets: SelectedPresets;
    }
  | {
      type: 'records';
      story: PureStory;
      config: PreviewState;
      presets: SelectedPresets;
    }
  | {
      type: 'screenshot';
      name: ScreenshotName | undefined;
      story: PureStory;
      config: PreviewState;
      presets: SelectedPresets;
    };
