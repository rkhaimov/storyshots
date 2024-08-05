import { SelectedPresets, StoryID } from '@storyshots/core';
import { createManagerRequest } from '../reusables/createManagerRequest';

// TODO: Deduplicate constants and url matching logic (client including)
export const PORT = 6006;
const _HOST = `http://localhost:${PORT}`;
export const HOST = createManagerRequest(_HOST);

export const createPathToStory = (id: StoryID, presets: SelectedPresets) =>
  createManagerRequest(
    `${_HOST}/chromium/${id}?presets=${encodeURIComponent(
      JSON.stringify(presets),
    )}`,
  );
