import { Props } from '../types';
import { useTestResults } from './useTestResults';
import { useSelection } from './useSelection';
import { useGroupExpand } from './useGroupExpand';

export function useBehaviour(props: Props) {
  const state = useSelection(props);
  const expand = useGroupExpand(state.selection);
  const results = useTestResults();

  return {
    ...expand,
    ...results,
    ...state,
  };
}
