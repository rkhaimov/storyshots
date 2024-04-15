import {
  Device,
  isNil,
  ScreenshotName,
  SelectedPresets,
  StoryID,
  TreeOP,
  DeviceName,
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
      navigate(`/${id}`, new URLSearchParams(), params.config);
    },
    setRecords: (id: StoryID, device: Device) => {
      navigate(
        `/${id}`,
        new URLSearchParams({ mode: Mode.Records, device: device.name }),
        params.config,
      );
    },
    setScreenshot: (id: StoryID, name: ScreenshotName, device: Device) => {
      const query = new URLSearchParams({
        mode: Mode.Screenshot,
        screenshot: name,
        device: device.name,
      });

      navigate(`/${id}`, query, params.config);
    },
    setConfig: (config: RunPreviewConfig) => {
      navigate(pathname, new URLSearchParams(search), config);
    },
  };
}

function useNavigation() {
  const [, navigate] = useLocation();

  return (
    url: string,
    query: URLSearchParams,
    config: Partial<RunPreviewConfig>,
  ) => {
    query.append('manager', 'SECRET');
    query.delete('config');
    query.append('config', JSON.stringify(config));

    navigate(`${url}?${query}`);
  };
}

function useParsedParams(props: Props) {
  const story = props.params.story as string | undefined;
  const search = useSearch();

  return useMemo((): URLParsedParams => {
    const params = new URLSearchParams(search);

    const config: Partial<RunPreviewConfig> = JSON.parse(
      params.get('config') ?? '{}',
    );

    if (isNil(story)) {
      return { type: 'no-selection', config };
    }

    const id = TreeOP.ensureIsLeafID(story);
    const device = params.get('device') as DeviceName | null;

    if (isNil(device)) {
      return {
        type: 'story',
        id,
        config,
      };
    }

    const mode = params.get('mode');

    if (mode === Mode.Records) {
      return {
        type: 'records',
        id,
        config,
        device,
      };
    }

    const name = params.get('screenshot') as ScreenshotName | null;

    if (mode === Mode.Screenshot && name) {
      return {
        type: 'screenshot',
        name,
        id,
        config,
        device,
      };
    }

    return {
      type: 'story',
      id,
      config,
    };
  }, [story, search]);
}

export type RunPreviewConfig = {
  device: Device & { emulated: boolean };
  presets: SelectedPresets;
};

export type URLParsedParams = { config: Partial<RunPreviewConfig> } & (
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
      name: ScreenshotName;
      device: DeviceName;
    }
  | {
      type: 'records';
      id: StoryID;
      device: DeviceName;
    }
);

enum Mode {
  Records = 'records',
  Screenshot = 'screenshot',
}
