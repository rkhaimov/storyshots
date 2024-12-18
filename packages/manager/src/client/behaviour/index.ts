import { useExportSelectionEffect } from './useExportSelectionEffect';
import { useGroupExpand } from './useGroupExpand';
import { useSelection } from './useSelection';
import { useStatusPane } from './useStatusPane';
import { useTestResults } from './useTestResults';

export function useBehaviour() {
  const test = useTestResults();
  const play = useSelection();
  const expand = useGroupExpand(play.selection);
  const pane = useStatusPane();

  useExportSelectionEffect(play.selection);

  return {
    ...expand,
    ...test,
    ...play,
    ...pane,
  };
}
