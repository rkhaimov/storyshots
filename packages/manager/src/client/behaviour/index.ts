import { useSelection } from './useSelection';
import { useGroupExpand } from './useGroupExpand';
import { useStatusPane } from './useStatusPane';
import { useTestResults } from './useTestResults';

export function useBehaviour() {
  const test = useTestResults();
  const play = useSelection();
  const expand = useGroupExpand(play.selection);
  const pane = useStatusPane();

  return {
    ...expand,
    ...test,
    ...play,
    ...pane,
  };
}
