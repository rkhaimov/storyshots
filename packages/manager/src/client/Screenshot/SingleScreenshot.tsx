import { PureStory, ScreenshotName } from '@storyshots/core';
import React from 'react';
import { UseBehaviourProps } from '../behaviour/types';
import {
  PresetScreenshotResult,
  TestResultDetails,
} from '../behaviour/useTestResults/types';
import { useExternals } from '../externals/context';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Accept';
import { ActionBack } from '../Workspace/Back';
import { DiffImgViewer } from './DiffImgViewer';
import { ImgViewer } from './ImgViewer';

type Props = {
  name: ScreenshotName;
  screenshot: PresetScreenshotResult;
  story: PureStory;
  details: TestResultDetails;
  onBack?: () => void;
} & Pick<UseBehaviourProps, 'acceptScreenshot'>;

export const SingleScreenshot: React.FC<Props> = ({
  name,
  details,
  screenshot,
  story,
  acceptScreenshot,
  onBack,
}): React.ReactElement => {
  const { driver } = useExternals();
  const actionBack = onBack && <ActionBack onAction={onBack} />;

  const { result } = screenshot;
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
