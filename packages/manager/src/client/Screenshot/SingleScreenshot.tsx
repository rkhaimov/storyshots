import React from 'react';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Accept';
import { DiffImgViewer } from './DiffImgViewer';
import { ImgViewer } from './ImgViewer';
import { ActionBack } from '../Workspace/Back';
import { SuccessTestResult } from '../behaviour/useTestResults/types';
import { UseBehaviourProps } from '../behaviour/types';
import { PureStory } from '@storyshots/core';
import { useDriver } from '../driver';
import { ScreenshotResult } from './types';

type Props = {
  screenshot: ScreenshotResult;
  story: PureStory;
  results: SuccessTestResult;
  onBack?: () => void;
} & Pick<UseBehaviourProps, 'acceptScreenshot'>;

export const SingleScreenshot: React.FC<Props> = ({
  screenshot,
  story,
  results,
  acceptScreenshot,
  onBack,
}): React.ReactElement => {
  const driver = useDriver();
  const actionBack = onBack && <ActionBack onAction={onBack} />;

  const { result, deviceName, name } = screenshot;
  const title = `${story.payload.title} — ${name ?? 'FINAL'}`;

  switch (result.type) {
    case 'fresh':
      return (
        <Workspace
          title={title}
          firstAction={actionBack}
          actions={
            <ActionAccept
              onAction={() =>
                acceptScreenshot(
                  story,
                  name,
                  deviceName,
                  result.actual,
                  results,
                )
              }
            />
          }
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
          actions={
            <ActionAccept
              onAction={() =>
                acceptScreenshot(
                  story,
                  name,
                  deviceName,
                  result.actual,
                  results,
                )
              }
            />
          }
        >
          <DiffImgViewer {...result} />
        </Workspace>
      );
  }
};
