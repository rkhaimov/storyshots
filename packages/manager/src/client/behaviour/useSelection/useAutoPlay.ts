import { PlayingState, Selection } from './types';
import { useEffect, useMemo, useState } from 'react';
import { createActor } from '@storyshots/core';
import { driver } from '../../externals/driver';

export function useAutoPlay(selection: Selection): Selection {
  const [playing, setPlaying] = useState<PlayingState>({ type: 'not-played' });

  useEffect(play, [selection]);

  return useMemo(enrichWithPlayingSelection, [selection, playing]);

  function play() {
    setPlaying({ type: 'not-played' });

    if (selection.type !== 'story') {
      return;
    }

    setPlaying({ type: 'playing' });

    const actions = selection.story.payload
      .act(createActor(), {
        device: selection.config.device,
        screenshotting: false,
      })
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
