import { useAutoPlay } from './useAutoPlay';
import { ManagerConfig } from './useManagerConfig';
import { usePreviewState } from './usePreviewState';
import { useTrustedSelection } from './useTrustedSelection';
import { useUserSelection } from './useUserSelection';

/**
 * Implements main user actions available for the manager:
 * * Opening stories, screenshots or records
 * * Playing stories upon opening, using actual preview configuration
 * * Persisting state between page reloads
 */
export function useSelection(manager: ManagerConfig) {
  const { preview, onPreviewLoaded } = usePreviewState();
  const { selection, ...handlers } = useUserSelection();

  const played = useAutoPlay(
    useTrustedSelection(preview, selection, manager),
    manager,
  );

  return {
    selection: played,
    onPreviewLoaded,
    ...handlers,
  };
}
