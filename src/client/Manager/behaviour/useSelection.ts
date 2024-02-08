import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useSearch } from 'wouter/use-location';
import {
  ScreenshotName,
  StoryID,
  WithPossibleError,
} from '../../../reusables/types';
import { isNil } from '../../../reusables/utils';
import { useExternals } from '../../externals/Context';
import {
  SerializableStoryNode,
  SerializableStoryshotsNode,
} from '../../reusables/channel';
import { findStoryLikeByID } from '../../reusables/findStoryLikeByID';
import { Props } from '../types';
import { communicateWithPreview } from './communicateWithPreview';
import { usePreviewBuildHash } from './usePreviewBuildHash';

// TODO: Test and simplify
export function useSelection(props: Props) {
  const { driver } = useExternals();
  const id = props.params.story as StoryID | undefined;
  const hash = usePreviewBuildHash();
  const search = useSearch();
  const identity = `${id}_${hash}_${search}`;
  const ref = useRef<HTMLIFrameElement>(null);

  const [, navigate] = useLocation();

  const [selection, setSelection] = useState<SelectionState>({
    type: 'initializing',
  });

  // TODO: Cancellation must be tested
  useEffect(() => {
    communicateWithPreview(ref, id, false).then(selectAndPlay);
  }, [identity]);

  return {
    selection,
    preview: {
      ref,
      key: identity,
    },
    setStory: (story: SerializableStoryNode) => {
      navigate(`/${story.id}`);
    },
    setRecords: (story: SerializableStoryNode) => {
      navigate(`/${story.id}?mode=${SelectionMode.Records}`);
    },
    setScreenshot: (
      story: SerializableStoryNode,
      name: ScreenshotName | undefined,
    ) => {
      navigate(
        isNil(name)
          ? `/${story.id}?mode=${SelectionMode.Screenshot}`
          : `/${story.id}?mode=${SelectionMode.Screenshot}&screenshot=${name}`,
      );
    },
  };

  async function selectAndPlay(stories: SerializableStoryshotsNode[]) {
    if (isNil(id)) {
      return setSelection({ type: 'no-selection', stories });
    }

    const story = findStoryLikeByID(stories, id);
    const params = new URLSearchParams(search);
    const mode = params.get('mode');

    if (mode === SelectionMode.Records) {
      return setSelection({
        type: 'records',
        stories,
        story,
      });
    }

    if (mode === SelectionMode.Screenshot) {
      return setSelection({
        type: 'screenshot',
        name: params.get('screenshot') ?? undefined,
        stories,
        story,
      });
    }

    setSelection({ type: 'story', stories, story, playing: true });

    const result = await driver.actOnClientSide(story.actions);

    return setSelection({
      type: 'story',
      stories,
      story,
      result,
      playing: false,
    });
  }
}

enum SelectionMode {
  Records = 'records',
  Screenshot = 'screenshot',
}

export type SelectionState =
  | { type: 'initializing' }
  | {
      type: 'no-selection';
      stories: SerializableStoryshotsNode[];
    }
  | {
      type: 'story';
      playing: true;
      story: SerializableStoryNode;
      stories: SerializableStoryshotsNode[];
    }
  | {
      type: 'story';
      playing: false;
      result: WithPossibleError<void>;
      story: SerializableStoryNode;
      stories: SerializableStoryshotsNode[];
    }
  | {
      type: 'screenshot';
      name: string | undefined;
      story: SerializableStoryNode;
      stories: SerializableStoryshotsNode[];
    }
  | {
      type: 'records';
      story: SerializableStoryNode;
      stories: SerializableStoryshotsNode[];
    };
