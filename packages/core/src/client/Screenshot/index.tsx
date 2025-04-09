import { isNil } from '@lib';
import React from 'react';
import { driver } from '../../reusables/runner/driver';
import { UseBehaviourProps } from '../behaviour/types';
import { ScreenshotSelection } from '../behaviour/useSelection/types';
import { Spinner } from '../reusables/Spinner';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Accept';
import { DiffImgViewer } from './DiffImgViewer';
import { ImgViewer } from './ImgViewer';

type Props = {
  selection: ScreenshotSelection;
} & Pick<UseBehaviourProps, 'acceptScreenshot' | 'results'>;

export const Screenshot: React.FC<Props> = ({
  selection,
  results,
  acceptScreenshot,
}): React.ReactElement => {
  const result = results.get(selection.story.id)?.get(selection.device);

  if (isNil(result)) {
    return <span>Screenshots are not generated yet, for a given device</span>;
  }

  if (result.type === 'running' || result.type === 'scheduled') {
    return <Spinner />;
  }

  if (result.details.type === 'error') {
    return (
      <span>Error has been caught during last run. Check the errors pane.</span>
    );
  }

  const screenshot = result.details.data.screenshots.find(
    (it) => it.name === selection.name,
  );

  if (isNil(screenshot)) {
    return <span>Given screenshot is missing</span>;
  }

  const title = `[${selection.device.name}] ${selection.story.title} ${screenshot.name}`;

  if (screenshot.type === 'fresh') {
    return (
      <Workspace
        title={title}
        actions={
          <ActionAccept
            onAction={() =>
              acceptScreenshot(selection.story.id, selection.device, screenshot)
            }
          />
        }
      >
        <ImgViewer type="fresh" src={driver.createImgSrc(screenshot.actual)} />
      </Workspace>
    );
  }

  if (screenshot.type === 'pass') {
    return (
      <Workspace title={title}>
        <ImgViewer type="pass" src={driver.createImgSrc(screenshot.actual)} />
      </Workspace>
    );
  }

  return (
    <Workspace
      title={title}
      actions={
        <ActionAccept
          onAction={() =>
            acceptScreenshot(selection.story.id, selection.device, screenshot)
          }
        />
      }
    >
      <DiffImgViewer
        key={selection.device.name}
        device={selection.device}
        {...screenshot}
      />
    </Workspace>
  );
};
