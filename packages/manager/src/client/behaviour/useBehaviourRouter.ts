import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { useSearch } from 'wouter/use-location';

import { Props } from '../types';
import {
  assertNotEmpty,
  isNil,
  ScreenshotName,
  SelectedPresets,
  StoryID,
  TreeOP,
} from '@storyshots/core';

export function useBehaviourRouter(props: Props) {
  const navigate = useNavigation();

  return {
    params: useParsedParams(props),
    setStory: (id: StoryID, presets: SelectedPresets) => {
      navigate(`/${id}?presets=${encodeURIComponent(JSON.stringify(presets))}`);
    },
    setRecords: (id: StoryID) => {
      navigate(`/${id}?mode=${Mode.Records}`);
    },
    setScreenshot: (id: StoryID, name: string | undefined) => {
      const screenshot = isNil(name) ? '' : `&screenshot=${name}`;

      navigate(`/${id}?mode=${Mode.Screenshot}${screenshot}`);
    },
  };
}

function useNavigation() {
  const search = useSearch();
  const [, navigate] = useLocation();

  return (url: string) => {
    const params = new URLSearchParams(search);
    const secret = params.get('manager');

    assertNotEmpty(secret);

    navigate(
      url.includes('?')
        ? `${url}&manager=${secret}`
        : `${url}?manager=${secret}`,
    );
  };
}

function useParsedParams(props: Props) {
  const story = props.params.story as string | undefined;
  const search = useSearch();

  return useMemo((): URLParsedParams => {
    const params = new URLSearchParams(search);
    const presets: SelectedPresets = JSON.parse(
      params.get('presets') ?? 'null',
    );

    if (isNil(story)) {
      return { type: 'no-selection', presets };
    }

    const id = TreeOP.ensureIsLeafID(story);
    const mode = params.get('mode');

    if (mode === Mode.Records) {
      return {
        type: 'records',
        id,
        presets,
      };
    }

    if (mode === Mode.Screenshot) {
      return {
        type: 'screenshot',
        name: (params.get('screenshot') as ScreenshotName) ?? undefined,
        id,
        presets,
      };
    }

    return {
      type: 'story',
      id,
      presets,
    };
  }, [story, search]);
}

export type URLParsedParams = { presets: SelectedPresets } & (
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
      name: ScreenshotName | undefined;
    }
  | {
      type: 'records';
      id: StoryID;
    }
);

enum Mode {
  Records = 'records',
  Screenshot = 'screenshot',
}
