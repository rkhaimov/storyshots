import { PlayingState, Selection } from './types';
import { useEffect, useMemo, useState } from 'react';
import { createActor } from '@storyshots/core';
import { driver } from '../../../reusables/runner/driver';
import { createReadyPreviewConfig } from './createPreviewConfig';

export function useAutoPlay(selection: Selection): Selection {
  const [playing, setPlaying] = useState<PlayingState>({ type: 'not-played' });

  useEffect(play, createComparableSelection(selection));

  return useMemo(enrichWithPlayingSelection, [selection, playing]);

  function play() {
    setPlaying({ type: 'not-played' });

    if (selection.type !== 'story') {
      return;
    }

    setPlaying({ type: 'playing' });

    const actions = selection.story.payload
      .act(createActor(), createReadyPreviewConfig(selection))
      .toMeta();

    driver.actOnClientSide(actions).then((result) =>
      setPlaying({
        type: 'played',
        result,
      }),
    );
  }

  function enrichWithPlayingSelection(): Selection {
    if (selection.type !== 'story') {
      return selection;
    }

    return { ...selection, state: playing };
  }
}

function createComparableSelection(selection: Selection): unknown[] {
  if (selection.type === 'initializing' || selection.config.emulated) {
    return [selection];
  }

  return allDependenciesExcept(selection, 'config');
}

function allDependenciesExcept<T extends Record<string, unknown>>(
  record: T,
  excluded: keyof T,
): unknown[] {
  return Object.entries(record)
    .filter(([key]) => key !== excluded)
    .map(([, value]) => value);
}
