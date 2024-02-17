type ManagerState = {
  id?: import('./types').StoryID;
  screenshotting: boolean;
};

interface Window {
  __REACT_DEVTOOLS_GLOBAL_HOOK__: unknown;

  setStoriesAndGetState(
    stories: import('../client/reusables/channel').EvaluatedStoryTree[],
  ): ManagerState;

  readJournalRecords(): import('./types').JournalRecord[];
}
