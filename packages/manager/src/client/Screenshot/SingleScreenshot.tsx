import React from 'react';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Accept';
import { DiffImgViewer } from './DiffImgViewer';
import { ImgViewer } from './ImgViewer';
import { ActionBack } from '../Workspace/Back';
import {
  SingleConfigScreenshotResult,
  SuccessTestResult,
} from '../behaviour/useTestResults/types';
import { UseBehaviourProps } from '../behaviour/types';
import { PureStory, ScreenshotName } from '@storyshots/core';
import { useDriver } from '../driver';
import { presetsToString } from './utils';

type Props = {
  name: ScreenshotName | undefined;
  screenshot: SingleConfigScreenshotResult;
  story: PureStory;
  results: SuccessTestResult;
  onBack?: () => void;
} & Pick<UseBehaviourProps, 'acceptScreenshot'>;

export const SingleScreenshot: React.FC<Props> = ({
  name,
  screenshot,
  story,
  results,
  acceptScreenshot,
  onBack,
}): React.ReactElement => {
  const driver = useDriver();
  const actionBack = onBack && <ActionBack onAction={onBack} />;

  const { result } = screenshot;
  const title = [
    story.payload.title,
    screenshot.config.device.name,
    presetsToString(screenshot.config.presets),
    name ?? 'FINAL',
  ]
    .filter((it) => it !== '')
    .join(' — ');

  const onAccept = () => {
    acceptScreenshot(story, name, result.actual, results);
    onBack && onBack();
  };

  switch (result.type) {
    case 'fresh':
      return (
        <Workspace
          title={title}
          firstAction={actionBack}
          actions={<ActionAccept onAction={onAccept} />}
        >
          <ImgViewer
            type="fresh"
            src={driver.createScreenshotPath(result.actual)}
          />
        </Workspace>
      );
    case 'pass':
      return (
        <Workspace firstAction={actionBack} title={title}>
          <ImgViewer
            type="pass"
            src={driver.createScreenshotPath(result.actual)}
          />
        </Workspace>
      );
    case 'fail':
      return (
        <Workspace
          title={title}
          firstAction={actionBack}
          actions={<ActionAccept onAction={onAccept} />}
        >
          <DiffImgViewer {...result} />
        </Workspace>
      );
  }
};
