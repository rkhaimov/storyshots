import { createJournal, Device, DeviceName, find, StoryTree } from '@core';
import { assertNotEmpty } from '@lib';
import { useMemo, useState } from 'react';
import { PreviewConnectionProps } from '../../reusables/ConnectedPreview/types';
import { Selection } from './types';
import { PreviewBuildHash, useBuildHash } from './useBuildHash';
import { ManagerConfig } from './useManagerConfig';
import { UserSelection } from './useUserSelection';

export function useTrustedSelection(
  untrusted: UserSelection,
  manager: ManagerConfig,
) {
  const hash = useBuildHash();
  const { stories, setStories } = useStoriesState(hash);

  const onPreviewLoaded: PreviewConnectionProps['onPreviewLoaded'] = (
    stories,
  ) => {
    setStories(stories);

    if (untrusted.type === 'no-selection') {
      return undefined;
    }

    const story = find(untrusted.id, stories);

    if (story === undefined) {
      return undefined;
    }

    return {
      story,
      config: {
        device: manager.device.preview,
        testing: false,
        journal: createJournal(),
      },
    };
  };

  return {
    identity: createPreviewIdentity(untrusted, manager, hash),
    onPreviewLoaded,
    trusted: useMemo((): Selection => {
      if (stories === undefined) {
        return { type: 'initializing' };
      }

      if (untrusted.type === 'no-selection') {
        return {
          stories,
          type: 'no-selection',
        };
      }

      const story = find(untrusted.id, stories);

      if (story === undefined) {
        return {
          stories,
          type: 'no-selection',
        };
      }

      if (untrusted.type === 'records') {
        return {
          stories,
          story,
          type: 'records',
          device: ensureSelectedDevice(manager.devices, untrusted.device),
        };
      }

      if (untrusted.type === 'screenshot') {
        return {
          stories,
          story,
          type: 'screenshot',
          name: untrusted.name,
          device: ensureSelectedDevice(manager.devices, untrusted.device),
        };
      }

      return {
        stories,
        story,
        type: 'story',
        selectedAt: untrusted.selectedAt,
        state: {
          type: 'not-played',
        },
      };
    }, [stories, untrusted, manager.devices]),
  };
}

function ensureSelectedDevice(devices: Device[], name: DeviceName): Device {
  const found = devices.find((it) => it.name === name);

  assertNotEmpty(found, 'Device is not defined. Press F5 to update');

  return found;
}

function createPreviewIdentity(
  untrusted: UserSelection,
  manager: ManagerConfig,
  hash: PreviewBuildHash,
) {
  return JSON.stringify(
    `${[
      untrusted.type === 'no-selection' ? undefined : untrusted.id,
      manager.device.preview,
    ]}${hash}`,
  );
}

function useStoriesState(hash: PreviewBuildHash) {
  const [state, setState] = useState<{
    stories: StoryTree;
    hash: PreviewBuildHash;
  }>();

  return {
    stories: state?.stories,
    setStories: (stories: StoryTree) => {
      // State is not initialized
      if (state === undefined) {
        setState({ stories, hash });

        return;
      }

      // Stories are the same
      if (state.hash === hash) {
        return;
      }

      setState({ stories, hash });
    },
  };
}
