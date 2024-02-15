import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { useSearch } from 'wouter/use-location';
import { ScreenshotName, StoryID } from '../../../reusables/types';
import { isNil } from '../../../reusables/utils';
import { Props } from '../types';

export function useBehaviourRouter(props: Props) {
  const [, navigate] = useLocation();

  return {
    params: useParsedParams(props),
    setStory: (id: StoryID) => {
      navigate(`/${id}`);
    },
    setRecords: (id: StoryID) => {
      navigate(`/${id}?mode=${Mode.Records}`);
    },
    setScreenshot: (id: StoryID, name: ScreenshotName | undefined) => {
      navigate(
        isNil(name)
          ? `/${id}?mode=${Mode.Screenshot}`
          : `/${id}?mode=${Mode.Screenshot}&screenshot=${name}`,
      );
    },
  };
}

function useParsedParams(props: Props) {
  const id = props.params.story as StoryID | undefined;
  const search = useSearch();

  return useMemo((): URLParsedParams => {
    if (isNil(id)) {
      return { type: 'no-selection' };
    }

    const params = new URLSearchParams(search);
    const mode = params.get('mode');

    if (mode === Mode.Records) {
      return {
        type: 'records',
        id,
      };
    }

    if (mode === Mode.Screenshot) {
      return {
        type: 'screenshot',
        name: params.get('screenshot') ?? undefined,
        id,
      };
    }

    return {
      type: 'story',
      id,
    };
  }, [id, search]);
}

export type URLParsedParams =
  | {
      type: 'no-selection';
    }
  | {
      type: 'story';
      id: StoryID;
    }
  | {
      type: 'screenshot';
      id: StoryID;
      name: string | undefined;
    }
  | {
      type: 'records';
      id: StoryID;
    };

enum Mode {
  Records = 'records',
  Screenshot = 'screenshot',
}
