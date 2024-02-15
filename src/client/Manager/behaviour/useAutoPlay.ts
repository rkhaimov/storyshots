import { useEffect, useState } from 'react';
import { WithPossibleError } from '../../../reusables/types';
import { useExternals } from '../../externals/Context';
import { IExternals } from '../../externals/types';
import { RichSelection } from './useRichSelection';

export function useAutoPlay(selection: RichSelection) {
  const { driver } = useExternals();
  const [playable, setPlayable] = useState(() => createInitialState(selection));

  // TODO: Implement cleanup
  useEffect(() => {
    const initial = createInitialState(selection);

    setPlayable(initial);

    createContinuingState(driver, initial).then((next) => setPlayable(next));
  }, [selection]);

  return playable as AutoPlaySelection;
}

function createInitialState(selection: RichSelection): AutoPlaySelection {
  if (selection.type !== 'story') {
    return selection;
  }

  return { ...selection, playing: true, key: new Date().toString() };
}

async function createContinuingState(
  driver: IExternals['driver'],
  selection: AutoPlaySelection,
): Promise<AutoPlaySelection> {
  if (selection.type !== 'story') {
    return selection;
  }

  const result = await driver.actOnClientSide(selection.story.actions);

  return { ...selection, playing: false, result };
}

export type AutoPlaySelection =
  | Exclude<RichSelection, StorySelection>
  | PlayingStorySelection;

type StorySelection = Extract<RichSelection, { type: 'story' }>;

type PlayingStorySelection = StorySelection &
  (
    | { playing: true; key: string }
    | {
        playing: false;
        key: string;
        result: WithPossibleError<void>;
      }
  );
