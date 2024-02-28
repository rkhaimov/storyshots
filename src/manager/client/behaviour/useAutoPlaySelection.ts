import { useEffect, useState } from 'react';
import { WithPossibleError } from '../../reusables/types';
import { PureStory, PureStoryTree, StoryID } from '../../../reusables/story';
import { useDriver } from '../driver';
import { URLParsedParams } from './useBehaviourRouter';
import { usePreviewBuildHash } from './usePreviewBuildHash';
import { TreeOP } from '../../../reusables/tree';
import { assertNotEmpty } from '../../../reusables/utils';

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
    const stories = await getStoriesAndSupplyState(
      params.type === 'no-selection' ? undefined : params.id,
    );

    if (params.type === 'no-selection') {
      return setSelection({ type: 'no-selection', stories });
    }

    const story = TreeOP.find(stories, params.id);

    assertNotEmpty(story);

    if (params.type === 'records') {
      return setSelection({ type: 'records', story, stories });
    }

    if (params.type === 'screenshot') {
      return setSelection({
        type: 'screenshot',
        story,
        stories,
        name: params.name,
      });
    }

    setSelection({ type: 'story', story, stories, playing: true });

    const result = await driver.actOnClientSide(story.payload.actions);

    setSelection({ type: 'story', story, stories, playing: false, result });
  }
}

export type AutoPlaySelection =
  | {
      type: 'initializing';
    }
  | {
      type: 'no-selection';
      stories: PureStoryTree[];
    }
  | {
      type: 'story';
      story: PureStory;
      stories: PureStoryTree[];
      playing: true;
    }
  | {
      type: 'story';
      story: PureStory;
      stories: PureStoryTree[];
      playing: false;
      result: WithPossibleError<void>;
    }
  | {
      type: 'records';
      story: PureStory;
      stories: PureStoryTree[];
    }
  | {
      type: 'screenshot';
      name: string | undefined;
      story: PureStory;
      stories: PureStoryTree[];
    };

function getStoriesAndSupplyState(id: StoryID | undefined) {
  return new Promise<PureStoryTree[]>((resolve) => {
    window.setStoriesAndGetState = (stories) => {
      resolve(stories);

      return { id, screenshotting: false };
    };
  });
}
