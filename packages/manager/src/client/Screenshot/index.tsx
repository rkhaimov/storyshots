import React from 'react';

import { UseBehaviourProps } from '../behaviour/types';
import { Spinner } from '../reusables/Spinner';
import { isNil } from '@storyshots/core';
import { SingleScreenshot } from './SingleScreenshot';
import { ScreenshotGallery } from './ScreenshotGallery';
import { pickScreenshots } from './utils';

type ScreenshotSelection = Extract<
  UseBehaviourProps['selection'],
  {
    type: 'screenshot';
  }
>;

type Props = {
  selection: ScreenshotSelection;
} & Pick<UseBehaviourProps, 'acceptScreenshot' | 'results'>;

export const Screenshot: React.FC<Props> = ({
  selection,
  results,
  acceptScreenshot,
}): React.ReactElement => {
  const result = results.get(selection.story.id);

  if (isNil(result)) {
    return <span>Screenshots are not generated yet</span>;
  }

  if (result.running) {
    return <Spinner />;
  }

  if (result.type === 'error') {
    return (
      <span>Error has been caught during last run. Check the errors pane.</span>
    );
  }

  const screenshots = pickScreenshots(selection.name, result);

  if (isNil(screenshots)) {
    return <span>Given screenshot is missing</span>;
  }

  if (screenshots.length > 1) {
    return (
      <ScreenshotGallery
        screenshots={screenshots}
        story={selection.story}
        acceptScreenshot={acceptScreenshot}
        result={result}
        name={selection.name}
      />
    );
  }

  return (
    <SingleScreenshot
      name={selection.name}
      screenshot={screenshots[0]}
      story={selection.story}
      acceptScreenshot={acceptScreenshot}
      results={result}
    />
  );
};
