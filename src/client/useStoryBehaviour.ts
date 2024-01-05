import { useEffect, useState } from 'react';
import { Story } from './types';
import { createActor } from './createActor';
import { createFinder } from './createFinder';

export function useStoryBehaviour() {
  const [story, setStory] = useState<Story | undefined>();

  useEffect(() => {
    if (story === undefined) {
      return;
    }

    const act = story.act;

    if (act === undefined) {
      return;
    }

    const actor = createActor();
    const finder = createFinder();

    const actions = act(actor, finder).toMeta();

    fetch('/api/act', {
      method: 'POST',
      body: JSON.stringify(actions),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }, [story]);

  return {
    story: story,
    setStory: (input: Story) => setStory(input),
  };
}
