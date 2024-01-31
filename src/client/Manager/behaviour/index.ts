import { Props } from '../types';
import { useTestResults } from './useTestResults';
import { useSelection } from './useSelection';
import { useGroupExpand } from './useGroupExpand';

export function useBehaviour(props: Props) {
  const test = useTestResults();
  const state = useSelection(props, test.results);
  const expand = useGroupExpand(state.selection);

  return {
    ...expand,
    ...test,
    ...state,
  };
}
