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
import { Errors } from '../Errors';

type ScreenshotSelection = Extract<
  SelectionState,
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

  if (isNil(result)) {
    return <span>Screenshots are not generated yet</span>;
  }

  if (result.running) {
    return <span>Screenshots are being generated</span>;
  }

  if (result.type === 'error') {
    return <Errors result={result} />;
  }

  if (isNil(selection.name)) {
    return renderSelectedScreenshotResults(
      undefined,
      result.screenshots.final,
      result,
    );
  }

  const selectedOtherScreenshot = result.screenshots.others.find(
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
