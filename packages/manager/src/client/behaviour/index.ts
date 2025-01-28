import { useExportSelectionEffect } from './useExportSelectionEffect';
import { useGroupExpand } from './useGroupExpand';
import { useSelection } from './useSelection';
import { useStatusPane } from './useStatusPane';
import { useTestResults } from './useTestResults';
import { useHighlighter } from './useHighlighter';

export function useBehaviour() {
  const test = useTestResults();
  const play = useSelection();
  const expand = useGroupExpand(play.selection);
  const pane = useStatusPane();
  const highlight = useHighlighter();

  useExportSelectionEffect(play.selection);

  return {
    ...expand,
    ...test,
    ...play,
    ...pane,
    highlight,
  };
}
