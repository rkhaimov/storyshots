import { Props } from '../types';
import { useAutoPlay } from './useAutoPlay';
import { useBehaviourRouter } from './useBehaviourRouter';
import { useGroupExpand } from './useGroupExpand';
import { useRichSelection } from './useRichSelection';
import { useTestResults } from './useTestResults';

export function useBehaviour(props: Props) {
  const test = useTestResults();
  const router = useBehaviourRouter(props);
  const selection = useRichSelection(router.params);
  const playable = useAutoPlay(selection);
  const expand = useGroupExpand(selection);

  return {
    ...expand,
    ...test,
    selection: playable,
    setStory: router.setStory,
    setRecords: router.setRecords,
    setScreenshot: router.setScreenshot,
  };
}
