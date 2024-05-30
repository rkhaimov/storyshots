import { Props } from '../types';
import { useAutoPlaySelection } from './useAutoPlaySelection';
import { useBehaviourRouter } from './useBehaviourRouter';
import { useGroupExpand } from './useGroupExpand';
import { useStatusPane } from './useStatusPane';
import { useTestResults } from './useTestResults';

export function useBehaviour(props: Props) {
  const test = useTestResults();
  const router = useBehaviourRouter(props);
  const play = useAutoPlaySelection(router.params);
  const expand = useGroupExpand(play.selection);
  const pane = useStatusPane();

  return {
    ...expand,
    ...test,
    ...play,
    ...pane,
    ...router,
  };
}
