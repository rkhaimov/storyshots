import { useAcceptBaseline } from './useAcceptBaseline';
import { useExposeRunAll } from './useExposeRunAll';
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

  useExposeRunAll(play.selection, manager);

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
