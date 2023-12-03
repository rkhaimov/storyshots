import { Props } from './types';
import { isNil } from '../../../../reusables/utils';
import React from 'react';

export const Records: React.FC<Props> = ({ story, results, setRecords }) => {
  const storyResults = results.get(story.id);

  if (isNil(storyResults)) {
    return;
  }

  if (storyResults.running) {
    return;
  }

  return (
    <span onClick={() => setRecords(story)}>{storyResults.records.type}</span>
  );
};
