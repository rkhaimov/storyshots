import { assertNotEmpty } from '@storyshots/core';
import { useEffect, useMemo, useState } from 'react';
import { driver } from '../../../reusables/runner/driver';
import { PlayingState, Selection } from './types';
import { ManagerConfig } from './useManagerConfig';

/**
 * Plays selected story automatically.
 */
export function useAutoPlay(
  selection: Selection,
  manager: ManagerConfig,
): Selection {
  const [playing, setPlaying] = useState<PlayingState>({ type: 'not-played' });

  // Replays when selection or preview device have been changed
  useEffect(() => void play(), [selection, manager.device.preview]);

  return useMemo(enrichWithPlayingSelection, [selection, playing]);

  async function play() {
    setPlaying({ type: 'not-played' });

    if (selection.type !== 'story') {
      return;
    }

    setPlaying({ type: 'playing' });

    const toPlay = selection.story.cases.find(
      (it) => it.device === manager.device.preview,
    );

    assertNotEmpty(toPlay);

    const result = await driver.play(toPlay.actions);

    setPlaying({
      type: 'played',
      result,
    });
  }

  function enrichWithPlayingSelection(): Selection {
    if (selection.type === 'story') {
      return { ...selection, state: playing };
    }

    return selection;
  }
}
