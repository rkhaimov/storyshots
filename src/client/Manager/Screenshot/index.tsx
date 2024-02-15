import React from 'react';
import { ScreenshotName } from '../../../reusables/types';
import { isNil } from '../../../reusables/utils';
import { useExternals } from '../../externals/Context';
import { UseBehaviourProps } from '../behaviour/types';
import {
  ScreenshotComparisonResult,
  SuccessTestResult,
} from '../behaviour/useTestResults/types';
import { Spinner } from '../reusables/Spinner';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Accept';
import { DiffImgViewer } from './DiffImgViewer';
import { ImgViewer } from './ImgViewer';

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
  const { driver } = useExternals();
  const result = results.get(selection.story.id);
  const title = `${selection.story.title} — ${selection.name ?? 'FINAL'}`;

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

  const primary = result.screenshots.primary.results;

  if (isNil(selection.name)) {
    return renderSelectedScreenshotResults(undefined, primary.final, result);
  }

  const selectedOtherScreenshot = primary.others.find(
    (it) => it.name === selection.name,
  );

  if (isNil(selectedOtherScreenshot)) {
    return <span>Given screenshot is missing</span>;
  }

  return renderSelectedScreenshotResults(
    selectedOtherScreenshot.name,
    selectedOtherScreenshot.result,
    result,
  );

  function renderSelectedScreenshotResults(
    name: ScreenshotName | undefined,
    result: ScreenshotComparisonResult,
    results: SuccessTestResult,
  ): React.ReactElement {
    switch (result.type) {
      case 'fresh':
        return (
          <Workspace
            title={title}
            actions={
              <ActionAccept
                onAction={() =>
                  acceptScreenshot(
                    selection.story,
                    name,
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
          <Workspace title={title}>
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
            actions={
              <ActionAccept
                onAction={() =>
                  acceptScreenshot(
                    selection.story,
                    name,
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
  }
};
