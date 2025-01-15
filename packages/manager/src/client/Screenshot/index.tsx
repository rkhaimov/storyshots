import { isNil } from '@storyshots/core';
import React from 'react';

import { UseBehaviourProps } from '../behaviour/types';
import { Spinner } from '../reusables/Spinner';
import { SingleScreenshot } from './SingleScreenshot';
import { ScreenshotSelection } from '../behaviour/useSelection/types';
import { isOnRun } from '../../reusables/runner/isOnRun';

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

  if (isOnRun(result)) {
    return <Spinner />;
  }

  if (result.type === 'error') {
    return (
      <span>Error has been caught during last run. Check the errors pane.</span>
    );
  }

  const details = result.details.find(
    (it) => it.device.name === selection.device,
  );

  if (isNil(details)) {
    return <span>Screenshots are not generated yet, for a given device</span>;
  }

  const screenshot = details.screenshots.find(
    (it) => it.name === selection.name,
  );

  if (isNil(screenshot)) {
    return <span>Given screenshot is missing</span>;
  }

  return (
    <SingleScreenshot
      screenshot={screenshot}
      story={selection.story}
      acceptScreenshot={acceptScreenshot}
      details={details}
    />
  );
};
