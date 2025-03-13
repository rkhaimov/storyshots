import {
  assertNotEmpty,
  Device,
  DeviceName,
  parseStoryID,
  PreviewState,
  PureStory,
  PureStoryTree,
  StoryID,
} from '@storyshots/core';
import { useMemo } from 'react';
import { Selection } from './types';
import { ManagerConfig } from './useManagerConfig';
import { UserSelection } from './useUserSelection';

export function useTrustedSelection(
  preview: PreviewState | undefined,
  untrusted: UserSelection,
  manager: ManagerConfig,
) {
  return useMemo((): Selection => {
    if (preview === undefined) {
      return { type: 'initializing' };
    }

    if (untrusted.type === 'no-selection') {
      return {
        ...preview,
        type: 'no-selection',
      };
    }

    const story = find(untrusted.id, preview.stories);

    if (story === undefined) {
      return {
        ...preview,
        type: 'no-selection',
      };
    }

    if (untrusted.type === 'records') {
      return {
        ...preview,
        story,
        type: 'records',
        device: ensureSelectedDevice(manager.devices, untrusted.device),
      };
    }

    if (untrusted.type === 'screenshot') {
      return {
        ...preview,
        story,
        type: 'screenshot',
        name: untrusted.name,
        device: ensureSelectedDevice(manager.devices, untrusted.device),
      };
    }

    return {
      ...preview,
      story,
      type: 'story',
      selectedAt: untrusted.selectedAt,
      state: {
        type: 'not-played',
      },
    };
  }, [preview, untrusted, manager.devices]);
}

function ensureSelectedDevice(devices: Device[], name: DeviceName): Device {
  const found = devices.find((it) => it.name === name);

  assertNotEmpty(found, 'Device is not defined. Press F5 to update');

  return found;
}

function find(id: StoryID, stories: PureStoryTree[]): PureStory | undefined {
  for (const node of stories) {
    switch (node.type) {
      case 'story': {
        if (node.id === id) {
          return node;
        }

        break;
      }
      case 'group': {
        if (parseStoryID(id).includes(node.id)) {
          return find(id, node.children);
        }

        break;
      }
    }
  }
}
