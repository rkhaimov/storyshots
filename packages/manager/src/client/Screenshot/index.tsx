import React from 'react';

import { UseBehaviourProps } from '../behaviour/types';
import { Spinner } from '../reusables/Spinner';
import { isNil } from '@storyshots/core';
import { SingleScreenshot } from './SingleScreenshot';
import { ScreenshotGallery } from './ScreenshotGallery';
import { pickScreenshot } from './utils';

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

  if (result.screenshots.additional.length > 0) {
    return (
      <ScreenshotGallery
        story={selection.story}
        acceptScreenshot={acceptScreenshot}
        result={result}
        name={selection.name}
      />
    );
  }

  const primaryScreenshot = pickScreenshot(
    selection.name,
    result.screenshots.primary,
  );

  if (isNil(primaryScreenshot)) {
    return <span>Given screenshot is missing</span>;
  }

  return (
    <SingleScreenshot
      screenshot={primaryScreenshot}
      story={selection.story}
      acceptScreenshot={acceptScreenshot}
      results={result}
    />
  );
};
