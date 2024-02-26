import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { useSearch } from 'wouter/use-location';

import { StoryID } from '../../../reusables/story';
import { assertNotEmpty, isNil } from '../../../reusables/utils';
import { Props } from '../types';
import { TreeOP } from '../../../reusables/tree';

export function useBehaviourRouter(props: Props) {
  const navigate = useNavigation();

  return {
    params: useParsedParams(props),
    setStory: (id: StoryID) => {
      navigate(`/${id}`);
    },
    setRecords: (id: StoryID) => {
      navigate(`/${id}?mode=${Mode.Records}`);
    },
    setScreenshot: (
      id: StoryID,
      name: string | undefined,
      deviceName: string | undefined,
    ) => {
      const screenshot = isNil(name) ? '' : `&screenshot=${name}`;
      const device = isNil(deviceName) ? '' : `&device=${deviceName}`;

      navigate(`/${id}?mode=${Mode.Screenshot}${screenshot}${device}`);
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
    if (isNil(story)) {
      return { type: 'no-selection' };
    }

    const id = TreeOP.ensureIsLeafID(story);
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
        device: params.get('device') ?? undefined,
        id,
      };
    }

    return {
      type: 'story',
      id,
    };
  }, [story, search]);
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
      device: string | undefined;
    }
  | {
      type: 'records';
      id: StoryID;
    };

enum Mode {
  Records = 'records',
  Screenshot = 'screenshot',
}
