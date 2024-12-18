import { PureStory, TreeOP } from '@storyshots/core';
import { useEffect } from 'react';
import { createRunnableStoriesSuits } from '../../reusables/runner/createRunnableStoriesSuits';
import { CIChannel } from '../../reusables/types';
import { Selection } from './useSelection/types';

export function useExportSelectionEffect(state: Selection) {
  useEffect(() => {
    (window as unknown as CIChannel).evaluate = () => {
      if (state.type === 'initializing') {
        return;
      }

      const stories: PureStory[] = TreeOP.toLeafsArray(state.preview.stories);

      return createRunnableStoriesSuits(
        stories,
        state.preview.devices.map((device) => ({ device })),
      );
    };
  }, [state]);
}
