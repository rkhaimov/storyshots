import { JournalRecord } from './journal/types';
import { PureStoryTree, StoryID } from './story';
import { Device } from './config';

export type PreviewState = {
  /** An array of story trees which are pure e.g. free of any webapi dependencies. */
  stories: PureStoryTree[];
};

export type ManagerState = {
  /** The ID of the story to be displayed in the preview. When undefined, then special placeholder will be shown instead */
  id?: StoryID;
  /** The device configuration for the preview. */
  device: Device;
  /** Indicates whether preview is ran for testing purposes, or it is just opened on manager in playing mode. */
  testing: boolean;
  /** All defined devices */
  devices: Device[];
};

declare global {
  interface Window {
    /**
     * Defined by the manager. Passes configuration relevant for preview, e.g. defined devices.
     * @param getState - Accepts user defined configuration and returns calculated state
     */
    onPreviewReady(getState: (config: ManagerState) => PreviewState): ManagerState;

    /**
     * Defined by the manager. Returns actual call journal.
     */
    getJournalRecords(): JournalRecord[];
  }
}
