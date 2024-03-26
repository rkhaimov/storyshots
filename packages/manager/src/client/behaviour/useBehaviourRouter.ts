import {
  assertNotEmpty,
  isNil,
  ScreenshotName,
  SelectedPresets,
  StoryID,
  TreeOP,
} from '@storyshots/core';
import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { useSearch } from 'wouter/use-location';

import { Props } from '../types';

export function useBehaviourRouter(props: Props) {
  const [pathname] = useLocation();
  const search = useSearch();
  const navigate = useNavigation();
  const params = useParsedParams(props);

  return {
    params,
    setStory: (id: StoryID) => {
      navigate(`/${id}`, new URLSearchParams(), params.presets);
    },
    setRecords: (id: StoryID) => {
      navigate(
        `/${id}`,
        new URLSearchParams({ mode: Mode.Records }),
        params.presets,
      );
    },
    setScreenshot: (id: StoryID, name: string | undefined) => {
      const query = new URLSearchParams({
        mode: Mode.Screenshot,
      });

      if (typeof name === 'string') {
        query.append('screenshot', name);
      }

      navigate(`/${id}`, query, params.presets);
    },
    setPresets: (presets: SelectedPresets) => {
      navigate(pathname, new URLSearchParams(search), presets);
    },
  };
}

function useNavigation() {
  const search = useSearch();
  const [, navigate] = useLocation();

  return (url: string, query: URLSearchParams, presets: SelectedPresets) => {
    const params = new URLSearchParams(search);
    const secret = params.get('manager');

    assertNotEmpty(secret);

    query.append('manager', secret);
    query.delete('presets');
    query.append('presets', JSON.stringify(presets));

    navigate(`${url}?${query}`);
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
