import { useState } from 'react';
import { Story } from './types';

export function useStoryBehaviour() {
  const [story, setStory] = useState<Story | undefined>();

  return {
    story: story,
    setStory: (input: Story) => setStory(input),
  };
}
