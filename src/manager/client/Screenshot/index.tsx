import React from 'react';

import { ScreenshotName } from '../../../reusables/screenshot';
import { isNil } from '../../../reusables/utils';
import { useDriver } from '../driver';
import { UseBehaviourProps } from '../behaviour/types';
import {
  ScreenshotComparisonResult,
  ScreenshotsComparisonResultsByMode,
  SuccessTestResult,
} from '../behaviour/useTestResults/types';
import { Spinner } from '../reusables/Spinner';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Accept';
import { DiffImgViewer } from './DiffImgViewer';
import { ImgViewer, Image } from './ImgViewer';
import styled from 'styled-components';
import { ActionBack } from '../Workspace/Back';

type ScreenshotSelection = Extract<
  UseBehaviourProps['selection'],
  {
    type: 'screenshot';
  }
>;

type Props = {
  selection: ScreenshotSelection;
} & Pick<UseBehaviourProps, 'setScreenshot' | 'acceptScreenshot' | 'results'>;

interface ScreenshotResult {
  name: ScreenshotName | undefined;
  deviceName: string;
  result: ScreenshotComparisonResult;
}

export const Screenshot: React.FC<Props> = ({
  selection,
  results,
  acceptScreenshot,
  setScreenshot,
}): React.ReactElement => {
  const driver = useDriver();
  const result = results.get(selection.story.id);
  const title = `${selection.story.payload.title} — ${selection.name ?? 'FINAL'}`;

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

  if (!isNil(selection.device) && result.screenshots.additional.length > 0) {
    if (result.screenshots.primary.device.name === selection.device) {
      return renderSingleScreenshot(result, result.screenshots.primary);
    }

    for (const comparisonResult of result.screenshots.additional) {
      if (comparisonResult.device.name === selection.device) {
        return renderSingleScreenshot(result, comparisonResult);
      }
    }

    return <span>Screenshot for given device is missing</span>;
  }

  if (result.screenshots.additional.length == 0) {
    return renderSingleScreenshot(result, result.screenshots.primary);
  }

  return renderScreenshotGallery(result);

  function renderScreenshotGallery(result: SuccessTestResult) {
    const screenshotList: ScreenshotResult[] = [];

    const primary = result.screenshots.primary;

    const primaryScreenshot = pickScreenshot(primary);

    if (isNil(primaryScreenshot)) {
      return <span>Given screenshot is missing</span>;
    }

    screenshotList.push(primaryScreenshot);

    for (const comparisonResult of result.screenshots.additional) {
      const additionalScreenshot = pickScreenshot(comparisonResult);

      if (additionalScreenshot != undefined) {
        screenshotList.push(additionalScreenshot);
      }
    }

    return (
      <ScreenshotGallery>
        {screenshotList.map((screenshot) => {
          return (
            <GalleryItem
              key={screenshot.result.actual}
              onClick={() => {
                setScreenshot(
                  selection.story.id,
                  selection.name,
                  screenshot.deviceName,
                );
              }}
            >
              <GalleryImage
                $type={screenshot.result.type}
                alt={screenshot.deviceName}
                src={driver.createScreenshotPath(screenshot.result.actual)}
              />
              <span>{screenshot.deviceName}</span>
            </GalleryItem>
          );
        })}
      </ScreenshotGallery>
    );
  }

  function pickScreenshot(
    comparisonResult: ScreenshotsComparisonResultsByMode,
  ): ScreenshotResult | undefined {
    if (isNil(selection.name)) {
      return {
        name: undefined,
        deviceName: comparisonResult.device.name,
        result: comparisonResult.results.final,
      };
    }

    const screenshot = comparisonResult.results.others.find(
      (it) => it.name === selection.name,
    );

    if (isNil(screenshot)) {
      return undefined;
    }

    return {
      deviceName: comparisonResult.device.name,
      ...screenshot,
    };
  }

  function renderSingleScreenshot(
    result: SuccessTestResult,
    screenshotResults: ScreenshotsComparisonResultsByMode,
  ) {
    const screenshot = pickScreenshot(screenshotResults);

    if (isNil(screenshot)) {
      return <span>Given screenshot is missing</span>;
    }

    return renderSelectedScreenshotResults(
      screenshot.name,
      screenshot.result,
      result,
    );
  }

  function renderSelectedScreenshotResults(
    name: ScreenshotName | undefined,
    result: ScreenshotComparisonResult,
    results: SuccessTestResult,
  ): React.ReactElement {
    const actionBack = isNil(selection.device) ? null : (
      <ActionBack
        onAction={() => {
          setScreenshot(selection.story.id, selection.name, undefined);
        }}
      />
    );

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
                    selection.story,
                    name,
                    selection.device,
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
                    selection.story,
                    name,
                    selection.device,
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

const ScreenshotGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: minmax(0, 300px);
  padding: 20px;
  gap: 20px;
`;

const GalleryItem = styled.button`
  display: flex;
  gap: 5px;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
`;

const GalleryImage = styled(Image)`
  min-height: 0;
`;
