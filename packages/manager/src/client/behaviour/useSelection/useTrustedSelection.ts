import { assertNotEmpty, PreviewState, TreeOP } from '@storyshots/core';
import { UntrustedSelection } from './useUntrustedSelection/types';
import { PreviewConfig, Selection } from './types';
import { useMemo } from 'react';

export function useTrustedSelection(
  preview: PreviewState | undefined,
  untrusted: UntrustedSelection,
) {
  return useMemo((): Selection => {
    if (preview === undefined) {
      return { type: 'initializing' };
    }

    const config = createTrustedConfig(preview, untrusted);

    if (untrusted.type === 'no-selection') {
      return {
        ...config,
        type: 'no-selection',
      };
    }

    const story = TreeOP.find(preview.stories, untrusted.id);

    if (story === undefined) {
      return {
        ...config,
        type: 'no-selection',
      };
    }

    if (untrusted.type === 'records') {
      return {
        ...config,
        story,
        type: 'records',
        device: untrusted.device,
      };
    }

    if (untrusted.type === 'screenshot') {
      return {
        ...config,
        story,
        type: 'screenshot',
        device: untrusted.device,
        name: untrusted.name,
      };
    }

    return {
      ...config,
      type: 'story',
      selectedAt: untrusted.selectedAt,
      story,
      state: {
        type: 'not-played',
      },
    };
  }, [preview, untrusted]);
}

function createTrustedConfig(
  preview: PreviewState,
  untrusted: UntrustedSelection,
): PreviewConfig {
  const found =
    untrusted.config.device === undefined
      ? preview.devices[0]
      : preview.devices.find((it) => it.name === untrusted.config.device);

  assertNotEmpty(found, 'Given configuration is misaligned with preview');

  return {
    preview,
    config: {
      device: found,
      emulated: untrusted.config.emulated,
    },
  };
}
