import { ReadySelection, Selection } from './types';
import { PreviewConfig } from '@storyshots/core';

export function createPreviewConfig(selection: Selection): PreviewConfig {
  if (selection.type === 'initializing') {
    return createInitializingPreviewConfig();
  }

  return createReadyPreviewConfig(selection);
}

export function createReadyPreviewConfig(selection: ReadySelection) {
  return {
    id: selection.type === 'no-selection' ? undefined : selection.story.id,
    // We are passing to preview selected device if and only if it is emulated
    device: selection.config.emulated
      ? selection.config.device
      : selection.preview.devices[0],
    screenshotting: false,
  } satisfies PreviewConfig;
}

function createInitializingPreviewConfig(): PreviewConfig {
  return {
    id: undefined,
    device: undefined,
    screenshotting: false,
  };
}
