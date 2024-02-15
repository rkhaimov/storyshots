import { useEffect, useRef, useState } from 'react';
import { EvaluatedStoryshotsNode } from '../../reusables/channel';
import { URLParsedParams } from './useBehaviourRouter';

// TODO: Simplify state sharing and managing
export function usePreviewChannel(
  params: URLParsedParams,
  screenshotting: boolean,
) {
  const id = params.type === 'no-selection' ? undefined : params.id;
  const onChangeRef = useRef((state: ManagerState) => {});
  const [stories, setStories] = useState<EvaluatedStoryshotsNode[]>();

  useEffect(() => {
    onChangeRef.current({ id, screenshotting });

    window.setStoriesAndGetState = (next) => {
      if (JSON.stringify(stories) !== JSON.stringify(next)) {
        setStories(next);
      }

      return {
        current: { id, screenshotting },
        next: (onChange) => (onChangeRef.current = onChange),
      };
    };
  }, [id, screenshotting]);

  return stories;
}
