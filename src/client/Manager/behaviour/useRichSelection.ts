import { useMemo } from 'react';
import { isNil } from '../../../reusables/utils';
import {
  EvaluatedStoryNode,
  EvaluatedStoryshotsNode,
} from '../../reusables/channel';
import { findStoryLikeByID } from '../../reusables/findStoryLikeByID';
import { URLParsedParams } from './useBehaviourRouter';
import { usePreviewChannel } from './usePreviewChannel';

export function useRichSelection(params: URLParsedParams) {
  const stories = usePreviewChannel(params, true);

  return useMemo((): RichSelection => {
    if (isNil(stories)) {
      return { type: 'initializing' };
    }

    if (params.type === 'no-selection') {
      return { type: 'no-selection', stories };
    }

    const story = findStoryLikeByID(stories, params.id);

    if (params.type === 'records') {
      return { type: 'records', story, stories };
    }

    if (params.type === 'screenshot') {
      return { type: 'screenshot', story, stories, name: params.name };
    }

    return { type: 'story', story, stories };
  }, [params, stories]);
}

export type RichSelection =
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
    }
  | {
      type: 'records';
      story: EvaluatedStoryNode;
      stories: EvaluatedStoryshotsNode[];
    }
  | {
      type: 'screenshot';
      name: string | undefined;
      story: EvaluatedStoryNode;
      stories: EvaluatedStoryshotsNode[];
    };
