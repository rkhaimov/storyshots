import { useAutoPlay } from './useAutoPlay';
import { ManagerConfig } from './useManagerConfig';
import { useTrustedSelection } from './useTrustedSelection';
import { useUserSelection } from './useUserSelection';

export function useSelection(manager: ManagerConfig) {
  const { selection, ...handlers } = useUserSelection();

  const { trusted, onPreviewLoaded, identity } = useTrustedSelection(
    selection,
    manager,
  );

  const played = useAutoPlay(trusted, manager);

  return {
    selection: played,
    identity,
    onPreviewLoaded,
    ...handlers,
  };
}
