type ManagerState = {
  id?: import('./story').StoryID;
  screenshotting: boolean;
};

interface Window {
  setStoriesAndGetState(
    stories: import('./story').PureStoryTree[],
  ): ManagerState;

  readJournalRecords(): import('./journal').JournalRecord[];
}
