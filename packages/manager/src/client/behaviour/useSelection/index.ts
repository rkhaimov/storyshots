import { usePreviewState } from './usePreviewState';
import { useUntrustedSelection } from './useUntrustedSelection';
import { useTrustedSelection } from './useTrustedSelection';
import { useAutoPlay } from './useAutoPlay';

export function useSelection() {
  const { preview, onStateChange } = usePreviewState();
  const { selection, ...handlers } = useUntrustedSelection();
  const played = useAutoPlay(useTrustedSelection(preview, selection));

  return {
    selection: played,
    ...handlers,
    onStateChange,
  };
}
