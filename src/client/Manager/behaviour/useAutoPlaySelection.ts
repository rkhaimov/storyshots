import { useEffect, useState } from 'react';
import { StoryID, WithPossibleError } from '../../../reusables/types';
import { useExternals } from '../../externals/Context';
import {
  EvaluatedStoryNode,
  EvaluatedStoryshotsNode,
} from '../../reusables/channel';
import { URLParsedParams } from './useBehaviourRouter';
import { usePreviewBuildHash } from './usePreviewBuildHash';
import { findStoryLikeByID } from '../../reusables/findStoryLikeByID';

// TODO: Solve cancellation problem
export function useAutoPlaySelection(params: URLParsedParams) {
  const { driver } = useExternals();
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

    const story = findStoryLikeByID(stories, params.id);

    if (params.type === 'records') {
      return setSelection({ type: 'records', story, stories });
    }

    if (params.type === 'screenshot') {
      return setSelection({
        type: 'screenshot',
        story,
        stories,
        name: params.name,
        device: params.device,
      });
    }

    setSelection({ type: 'story', story, stories, playing: true });

    const result = await driver.actOnClientSide(story.actions);

    setSelection({ type: 'story', story, stories, playing: false, result });
  }
}

export type AutoPlaySelection =
  | {
      type: 'initializing';
    }
  | {
      type: 'no-selection';
      stories: EvaluatedStoryshotsNode[];
    }
  | {
      type: 'story';
      story: EvaluatedStoryNode;
      stories: EvaluatedStoryshotsNode[];
      playing: true;
    }
  | {
      type: 'story';
      story: EvaluatedStoryNode;
      stories: EvaluatedStoryshotsNode[];
      playing: false;
      result: WithPossibleError<void>;
    }
  | {
      type: 'records';
      story: EvaluatedStoryNode;
      stories: EvaluatedStoryshotsNode[];
    }
  | {
      type: 'screenshot';
      name: string | undefined;
      device: string | undefined;
      story: EvaluatedStoryNode;
      stories: EvaluatedStoryshotsNode[];
    };

function getStoriesAndSupplyState(id: StoryID | undefined) {
  return new Promise<EvaluatedStoryshotsNode[]>((resolve) => {
    window.setStoriesAndGetState = (stories) => {
      resolve(stories);

      return { id, screenshotting: false };
    };
  });
}
