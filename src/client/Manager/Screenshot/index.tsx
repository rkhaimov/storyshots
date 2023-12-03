import React from 'react';
import ReactCompareImage from 'react-compare-image';
import { useExternals } from '../../externals/Context';
import { isNil } from '../../../reusables/utils';
import { SelectionState } from '../behaviour/useSelection';
import {
  ReadyTestResult,
  ScreenshotComparisonResult,
} from '../behaviour/useTestResults/types';
import { UseBehaviourProps } from '../behaviour/types';
import { ScreenshotName } from '../../../reusables/types';

type ScreenshotSelection = Extract<
  SelectionState,
  {
    type: 'screenshot';
  }
>;

type Props = {
  selection: ScreenshotSelection;
} & Pick<UseBehaviourProps, 'results' | 'acceptScreenshot'>;

export const Screenshot: React.FC<Props> = ({
  results,
  selection,
  acceptScreenshot,
}): React.ReactElement => {
  const { driver } = useExternals();
  const storyResults = results.get(selection.story.id);

  // TODO: Test it
  if (isNil(storyResults) || storyResults.running) {
    return <span>Screenshots are not generated yet</span>;
  }

  if (isNil(selection.name)) {
    return renderSelectedScreenshotResults(
      undefined,
      storyResults.screenshots.final,
      storyResults,
    );
  }

  const selectedOtherScreenshot = storyResults.screenshots.others.find(
    (it) => it.name === selection.name,
  );

  if (isNil(selectedOtherScreenshot)) {
    return <span>Given screenshot is missing</span>;
  }

  return renderSelectedScreenshotResults(
    selectedOtherScreenshot.name,
    selectedOtherScreenshot.result,
    storyResults,
  );

  function renderSelectedScreenshotResults(
    name: ScreenshotName | undefined,
    result: ScreenshotComparisonResult,
    results: ReadyTestResult,
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
