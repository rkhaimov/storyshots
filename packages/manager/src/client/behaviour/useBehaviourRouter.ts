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
  const params = useParsedParams(props);

  return {
    params,
    setStory: (id: StoryID) => {
      doNavigate(
        {
          type: 'story',
          id,
          presets: params.presets,
        },
        navigate,
      );
    },
    setRecords: (id: StoryID) => {
      doNavigate(
        {
          type: 'records',
          id,
          presets: params.presets,
        },
        navigate,
      );
    },
    setScreenshot: (id: StoryID, name: string | undefined) => {
      doNavigate(
        {
          type: 'screenshot',
          id,
          name: name as ScreenshotName | undefined,
          presets: params.presets,
        },
        navigate,
      );
    },
    setPresets: (presets: SelectedPresets) => {
      doNavigate(
        {
          ...params,
          presets,
        },
        navigate,
      );
    },
  };
}

function doNavigate(params: URLParsedParams, navigate: (url: string) => void) {
  const presetParam = `presets=${encodeURIComponent(
    JSON.stringify(params.presets),
  )}`;

  switch (params.type) {
    case 'no-selection':
      return navigate(`/?${presetParam}`);
    case 'story':
      return navigate(`/${params.id}?${presetParam}`);
    case 'screenshot': {
      const screenshot = isNil(params.name) ? '' : `&screenshot=${params.name}`;
      return navigate(
        `/${params.id}?${presetParam}&mode=${Mode.Screenshot}${screenshot}`,
      );
    }
    case 'records':
      return navigate(`/${params.id}?${presetParam}&mode=${Mode.Records}`);
  }
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
