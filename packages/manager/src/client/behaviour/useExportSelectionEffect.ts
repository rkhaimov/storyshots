import { useEffect } from 'react';
import { Selection } from './useSelection/types';

export function useExportSelectionEffect(state: Selection) {
  useEffect(() => {
    window.getStories = () => {
      if (state.type === 'initializing') {
        return;
      }

      return state.stories;
    };
  }, [state]);
}
