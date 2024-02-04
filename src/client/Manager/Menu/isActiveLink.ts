import { useParams } from 'wouter';
import { isNil } from '../../../reusables/utils';
import type { SelectionState } from '../behaviour/useSelection';
import type { StoryID } from '../../../reusables/types';

const searchTypes: Array<SelectionState['type']> = [
  'story',
  'screenshot',
  'records',
];

export const isActiveLink = (
  type: SelectionState['type'],
  story: StoryID,
  title?: string,
) => {
  const { story: currentStory } = useParams();
  const search = new URLSearchParams(window.location.search);

  if (!searchTypes.includes(type) || !currentStory || story !== currentStory) {
    return false;
  }

  const mode = search.get('mode');
  const screenshot = search.get('screenshot');

  switch (type) {
    case 'story':
      return isNil(mode);
    case 'records':
      return mode === 'records';
    case 'screenshot':
      return (
        mode === 'screenshot' &&
        (title === screenshot || (!title && isNil(screenshot)))
      );
    default:
      break;
  }

  return false;
};
