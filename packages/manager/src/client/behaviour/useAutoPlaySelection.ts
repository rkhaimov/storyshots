import {
  assertNotEmpty,
  createActor,
  DeviceName,
  PreviewState,
  PureStory,
  ScreenshotName,
  TreeOP,
} from '@storyshots/core';
import { useEffect, useState } from 'react';
import { WithPossibleError } from '../../reusables/types';

import { useExternals } from '../externals/context';
import { RunPreviewConfig, URLParsedParams } from './useBehaviourRouter';

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
    const state = await preview.createPreviewConnection({
      id: params.type === 'no-selection' ? undefined : params.id,
      screenshotting: false,
      // TODO: There is a general problem of misconfiguration between url params and actual preview config
      presets: params.config.presets ?? {},
      device: params.config.device?.emulated ? params.config.device : undefined,
    });

    const config: RunPreviewConfig = {
      presets:
        params.config.presets ??
        state.presets.reduce(
          (acc, it) => ({
            ...acc,
            [it.name]: it.default,
          }),
          {},
        ),
      device: params.config.device ?? {
        ...state.devices[0],
        emulated: false,
      },
    };

    if (params.type === 'no-selection') {
      return setSelection({
        type: 'no-selection',
        preview: state,
        config: config,
      });
    }

    const story = TreeOP.find(state.stories, params.id);

    assertNotEmpty(story);

    if (params.type === 'records') {
      return setSelection({
        type: 'records',
        story,
        preview: state,
        config: config,
        device: params.device,
      });
    }

    if (params.type === 'screenshot') {
      return setSelection({
        type: 'screenshot',
        story,
        preview: state,
        name: params.name,
        config: config,
        device: params.device,
      });
    }

    setSelection({
      type: 'story',
      story,
      preview: state,
      playing: true,
      config: config,
    });

    const actions = story.payload
      .act(createActor(), { ...config, screenshotting: false })
      .toMeta();

    const result = await driver.actOnClientSide(actions);

    setSelection({
      type: 'story',
      story,
      preview: state,
      playing: false,
      result,
      config: config,
    });
  }
}

export type AutoPlaySelection =
  | {
      type: 'initializing';
    }
  | AutoPlaySelectionInitialized;

export type AutoPlaySelectionInitialized = StateAndConfig &
  (
    | {
        type: 'no-selection';
      }
    | {
        type: 'story';
        story: PureStory;
        playing: true;
      }
    | {
        type: 'story';
        story: PureStory;
        playing: false;
        result: WithPossibleError<void>;
      }
    | {
        type: 'records';
        story: PureStory;
        device: DeviceName;
      }
    | {
        type: 'screenshot';
        name: ScreenshotName;
        story: PureStory;
        device: DeviceName;
      }
  );

type StateAndConfig = {
  preview: PreviewState;
  config: RunPreviewConfig;
};
