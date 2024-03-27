import { Props } from '../types';
import { useAutoPlaySelection } from './useAutoPlaySelection';
import { useBehaviourRouter } from './useBehaviourRouter';
import { useGroupExpand } from './useGroupExpand';
import { useTestResults } from './useTestResults';

export function useBehaviour(props: Props) {
  const test = useTestResults();
  const router = useBehaviourRouter(props);
  const play = useAutoPlaySelection(router.params);
  const expand = useGroupExpand(play.selection);

  return {
    ...expand,
    ...test,
    ...play,
    setStory: router.setStory,
    setRecords: router.setRecords,
    setScreenshot: router.setScreenshot,
    setPresets: router.setPresets,
  };
}
