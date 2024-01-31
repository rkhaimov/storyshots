import React from 'react';
import { SuccessTestResult } from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from './types';

type Props = { results: SuccessTestResult } & Pick<
  ParentProps,
  'setScreenshot' | 'story'
>;

export const ScreenshotsEntry: React.FC<Props> = ({
  story,
  results,
  setScreenshot,
}) => {
  const screenshots = results.screenshots;

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
