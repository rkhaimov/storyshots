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
import {
  FailedTestResult,
  TestResult,
  TestResults,
} from './useTestResults/types';

// TODO: Test and simplify
export function useSelection(props: Props, results: TestResults) {
  const { driver } = useExternals();
  const id = props.params.story as StoryID | undefined;
  const hash = usePreviewBuildHash();
  const search = useSearch();
  const key = `${id}_${hash}_${search}`;
  const ref = useRef<HTMLIFrameElement>(null);

  const [, navigate] = useLocation();

  const [selection, setSelection] = useState<SelectionState>({
    type: 'initializing',
  });

  // TODO: Cancellation must be tested
  useEffect(() => {
    communicateWithPreview(ref, id).then(selectAndPlay);
  }, [key]);

  return {
    selection,
    preview: {
      ref,
      key,
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
    setError: (story: SerializableStoryNode) => {
      navigate(`/${story.id}?mode=${SelectionMode.Errors}`);
    },
  };

  async function selectAndPlay(stories: SerializableStoryshotsNode[]) {
    if (isNil(id)) {
      return setSelection({ type: 'no-selection', stories });
    }

    const story = findStoryLikeByID(stories, id);
    const result = results.get(story.id);

    if (isNil(result)) {
      return setStorySelection(stories, story);
    }

    const params = new URLSearchParams(search);
    const mode = params.get('mode');

    if (mode === SelectionMode.Errors) {
      if (result.running) {
        return setStorySelection(stories, story);
      }

      if (result.type === 'success') {
        return setStorySelection(stories, story);
      }

      return setSelection({
        type: 'error',
        result,
        stories,
        story,
      });
    }

    if (mode === SelectionMode.Records) {
      if (result.running || result.type === 'success') {
        return setSelection({
          type: 'records',
          stories,
          story,
          result: result,
        });
      }

      return setSelection({
        type: 'error',
        result,
        stories,
        story,
      });
    }

    if (mode === SelectionMode.Screenshot) {
      if (result.running || result.type === 'success') {
        return setSelection({
          type: 'screenshot',
          name: params.get('screenshot') ?? undefined,
          stories,
          story,
          result,
        });
      }

      return setSelection({
        type: 'error',
        result,
        stories,
        story,
      });
    }

    return setStorySelection(stories, story);
  }

  async function setStorySelection(
    stories: SerializableStoryshotsNode[],
    story: SerializableStoryNode,
  ) {
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
  Errors = 'errors',
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
      result: WithPossibleError<null>;
      story: SerializableStoryNode;
      stories: SerializableStoryshotsNode[];
    }
  | {
      type: 'error';
      result: FailedTestResult;
      story: SerializableStoryNode;
      stories: SerializableStoryshotsNode[];
    }
  | {
      type: 'screenshot';
      name: string | undefined;
      result: Exclude<TestResult, FailedTestResult>;
      story: SerializableStoryNode;
      stories: SerializableStoryshotsNode[];
    }
  | {
      type: 'records';
      result: Exclude<TestResult, FailedTestResult>;
      story: SerializableStoryNode;
      stories: SerializableStoryshotsNode[];
    };
