import React from 'react';
import ReactCompareImage from 'react-compare-image';
import { ScreenshotName } from '../../../reusables/types';
import { isNil } from '../../../reusables/utils';
import { useExternals } from '../../externals/Context';
import { UseBehaviourProps } from '../behaviour/types';
import { SelectionState } from '../behaviour/useSelection';
import {
  ScreenshotComparisonResult,
  SuccessTestResult,
} from '../behaviour/useTestResults/types';

type ScreenshotSelection = Extract<
  SelectionState,
  {
    type: 'screenshot';
  }
>;

type Props = {
  selection: ScreenshotSelection;
} & Pick<UseBehaviourProps, 'acceptScreenshot'>;

export const Screenshot: React.FC<Props> = ({
  selection,
  acceptScreenshot,
}): React.ReactElement => {
  const { driver } = useExternals();

  // TODO: Test it
  if (selection.result.running) {
    return <span>Screenshots are being generated</span>;
  }

  if (isNil(selection.name)) {
    return renderSelectedScreenshotResults(
      undefined,
      selection.result.screenshots.final,
      selection.result,
    );
  }

  const selectedOtherScreenshot = selection.result.screenshots.others.find(
    (it) => it.name === selection.name,
  );

  if (isNil(selectedOtherScreenshot)) {
    return <span>Given screenshot is missing</span>;
  }

  return renderSelectedScreenshotResults(
    selectedOtherScreenshot.name,
    selectedOtherScreenshot.result,
    selection.result,
  );

  function renderSelectedScreenshotResults(
    name: ScreenshotName | undefined,
    result: ScreenshotComparisonResult,
    results: SuccessTestResult,
  ): React.ReactElement {
    switch (result.type) {
      case 'fresh':
        return (
          <>
            <button
              onClick={() =>
                acceptScreenshot(selection.story, name, result.actual, results)
              }
            >
              Accept
            </button>
            <img src={driver.createScreenshotPath(result.actual)} />
          </>
        );
      case 'pass':
        return <img src={driver.createScreenshotPath(result.actual)} />;
      case 'fail':
        return (
          <>
            <button
              onClick={() =>
                acceptScreenshot(selection.story, name, result.actual, results)
              }
            >
              Accept
            </button>
            <span>DIFF</span>
            <ReactCompareImage
              leftImage={driver.createScreenshotPath(result.expected)}
              rightImage={driver.createScreenshotPath(result.actual)}
              leftImageLabel="Expected"
              rightImageLabel="Actual"
            />
          </>
        );
    }
  }
};
