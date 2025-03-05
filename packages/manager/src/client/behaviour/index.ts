import { useAcceptBaseline } from './useAcceptBaseline';
import { useExportSelectionEffect } from './useExportSelectionEffect';
import { useGroupExpand } from './useGroupExpand';
import { useHighlighter } from './useHighlighter';
import { useRun } from './useRun';
import { useSelection } from './useSelection';
import { useManagerConfig } from './useSelection/useManagerConfig';
import { useStatusPane } from './useStatusPane';

export function useBehaviour() {
  const manager = useManagerConfig();
  const run = useRun(manager);
  const accept = useAcceptBaseline(run);
  const play = useSelection(manager);
  const expand = useGroupExpand(play.selection);
  const pane = useStatusPane();
  const highlight = useHighlighter();

  useExportSelectionEffect(play.selection);

  return {
    ...manager,
    ...expand,
    ...play,
    ...pane,
    ...run,
    ...accept,
    ...highlight,
  };
}
