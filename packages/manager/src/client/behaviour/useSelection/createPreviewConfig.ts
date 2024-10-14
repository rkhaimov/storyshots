import { Selection } from './types';
import { PreviewConfig } from '@storyshots/core';

export function createPreviewConfig(selection: Selection): PreviewConfig {
  if (selection.type === 'initializing') {
    return {
      id: undefined,
      device: undefined,
      screenshotting: false,
      emulated: false,
      key: '',
    };
  }

  return {
    id: selection.type === 'no-selection' ? undefined : selection.story.id,
    device: selection.config.device,
    emulated: selection.config.emulated,
    screenshotting: false,
    key: selection.type === 'story' ? selection.selectedAt.toString() : '',
  };
}
