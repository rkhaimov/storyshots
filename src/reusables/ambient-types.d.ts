type State<T> = {
  current: T;
  next(onChange: (value: T) => void): void;
};

type ManagerState = {
  id?: import('./types').StoryID;
  screenshotting: boolean;
};

interface Window {
  __REACT_DEVTOOLS_GLOBAL_HOOK__: unknown;

  setStoriesAndGetState(
    stories: import('../client/reusables/channel').EvaluatedStoryshotsNode[],
  ): State<ManagerState>;

  readJournalRecords(): import('./types').JournalRecord[];
}
