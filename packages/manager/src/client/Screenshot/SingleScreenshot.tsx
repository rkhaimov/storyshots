import { PureStory } from '@storyshots/core';
import React from 'react';
import { ScreenshotResult, TestResultDetails } from '../../reusables/runner/types';
import { UseBehaviourProps } from '../behaviour/types';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Accept';
import { ActionBack } from '../Workspace/Back';
import { DiffImgViewer } from './DiffImgViewer';
import { ImgViewer } from './ImgViewer';
import { driver } from '../../reusables/runner/driver';

type Props = {
  screenshot: ScreenshotResult;
  story: PureStory;
  details: TestResultDetails;
  onBack?: () => void;
} & Pick<UseBehaviourProps, 'acceptScreenshot'>;

export const SingleScreenshot: React.FC<Props> = ({
  details,
  screenshot,
  story,
  acceptScreenshot,
  onBack,
}): React.ReactElement => {
  const actionBack = onBack && <ActionBack onAction={onBack} />;

  const { result, name } = screenshot;
  const title = [story.payload.title, name ?? 'FINAL']
    .filter((it) => it !== '')
    .join(' — ');

  switch (result.type) {
    case 'fresh':
      return (
        <Workspace
          title={title}
          firstAction={actionBack}
          actions={
            <ActionAccept
              onAction={() => {
                acceptScreenshot({ result, details });

                onBack && onBack();
              }}
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
              onAction={() => {
                acceptScreenshot({ result, details });

                onBack && onBack();
              }}
            />
          }
        >
          <DiffImgViewer {...result} />
        </Workspace>
      );
  }
};
