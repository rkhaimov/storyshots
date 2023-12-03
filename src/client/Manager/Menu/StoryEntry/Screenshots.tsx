import React from 'react';
import { isNil } from '../../../../reusables/utils';
import { Props } from './types';

export const Screenshots: React.FC<Props> = ({
  story,
  results,
  setScreenshot,
}) => {
  const storyResults = results.get(story.id);

  if (isNil(storyResults) || storyResults.running) {
    return;
  }

  const screenshots = storyResults.screenshots;

  return (
    <ul>
      {screenshots.others.map((it) => (
        <li key={it.name} onClick={() => setScreenshot(story, it.name)}>
          {it.result.type}
          {it.name}
        </li>
      ))}
      <li key="final" onClick={() => setScreenshot(story, undefined)}>
        {screenshots.final.type}
        FINAL
      </li>
    </ul>
  );
};
