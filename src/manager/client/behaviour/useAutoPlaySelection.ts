import { useEffect, useState } from 'react';
import { WithPossibleError } from '../../reusables/types';
import { PureStory, StoryID } from '../../../reusables/story';
import { useDriver } from '../driver';
import { URLParsedParams } from './useBehaviourRouter';
import { usePreviewBuildHash } from './usePreviewBuildHash';
import { TreeOP } from '../../../reusables/tree';
import { assertNotEmpty } from '../../../reusables/utils';
import { AppConfig } from './types';

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
    const config = await getAppConfigAndSupplyState(
      params.type === 'no-selection' ? undefined : params.id,
      params.type === 'story' ? params.presets : {},
    );

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
      config: AppConfig;
    }
  | {
      type: 'story';
      story: PureStory;
      config: AppConfig;
      playing: true;
    }
  | {
      type: 'story';
      story: PureStory;
      config: AppConfig;
      playing: false;
      result: WithPossibleError<void>;
    }
  | {
      type: 'records';
      story: PureStory;
      config: AppConfig;
    }
  | {
      type: 'screenshot';
      name: string | undefined;
      story: PureStory;
      config: AppConfig;
    };

function getAppConfigAndSupplyState(
  id: StoryID | undefined,
  selectedPresets: SelectedPresets,
) {
  return new Promise<AppConfig>((resolve) => {
    window.setAppConfigAndGetState = (stories, devices, presets) => {
      resolve({ stories, devices, presets });

      return { id, screenshotting: false, selectedPresets };
    };
  });
}
