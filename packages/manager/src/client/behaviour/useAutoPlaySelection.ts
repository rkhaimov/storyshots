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
      return setSelection({ type: 'no-selection', config });
    }

    const story = TreeOP.find(config.stories, params.id);

    assertNotEmpty(story);

    if (params.type === 'records') {
      return setSelection({ type: 'records', story, config });
    }

    if (params.type === 'screenshot') {
      return setSelection({
        type: 'screenshot',
        story,
        config,
        name: params.name,
      });
    }

    setSelection({ type: 'story', story, config, playing: true });

    const result = await driver.actOnClientSide(story.payload.actions);

    setSelection({ type: 'story', story, config, playing: false, result });
  }
}

export type AutoPlaySelection =
  | {
      type: 'initializing';
    }
  | {
      type: 'no-selection';
      config: PreviewState;
    }
  | {
      type: 'story';
      story: PureStory;
      config: PreviewState;
      playing: true;
    }
  | {
      type: 'story';
      story: PureStory;
      config: PreviewState;
      playing: false;
      result: WithPossibleError<void>;
    }
  | {
      type: 'records';
      story: PureStory;
      config: PreviewState;
    }
  | {
      type: 'screenshot';
      name: string | undefined;
      story: PureStory;
      config: PreviewState;
    };
