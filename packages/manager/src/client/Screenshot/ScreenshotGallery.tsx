import React, { useState } from 'react';
import styled from 'styled-components';
import { Image } from './ImgViewer';
import { pickScreenshot } from './utils';
import { useDriver } from '../driver';
import { SuccessTestResult } from '../behaviour/useTestResults/types';
import { PureStory, isNil } from '@storyshots/core';
import { ScreenshotResult } from './types';
import { UseBehaviourProps } from '../behaviour/types';
import { SingleScreenshot } from './SingleScreenshot';

type Props = {
  name: string | undefined;
  story: PureStory;
  result: SuccessTestResult;
} & Pick<UseBehaviourProps, 'acceptScreenshot'>;

export const ScreenshotGallery: React.FC<Props> = ({
  story,
  name,
  result,
  acceptScreenshot,
}) => {
  const driver = useDriver();
  const [currentScreenshot, setScreenshot] = useState<ScreenshotResult | null>(
    null,
  );

  if (!isNil(currentScreenshot)) {
    return (
      <SingleScreenshot
        screenshot={currentScreenshot}
        story={story}
        acceptScreenshot={acceptScreenshot}
        onBack={() => setScreenshot(null)}
        results={result}
      />
    );
  }

  const primary = result.screenshots.primary;

  const primaryScreenshot = pickScreenshot(name, primary);

  if (isNil(primaryScreenshot)) {
    return <span>Given screenshot is missing</span>;
  }

  const screenshotList: ScreenshotResult[] = [primaryScreenshot];

  for (const comparisonResult of result.screenshots.additional) {
    const additionalScreenshot = pickScreenshot(name, comparisonResult);

    if (additionalScreenshot != undefined) {
      screenshotList.push(additionalScreenshot);
    }
  }

  return (
    <Wrapper>
      {screenshotList.map((screenshot) => {
        return (
          <GalleryItem
            key={screenshot.result.actual}
            onClick={() => {
              setScreenshot(screenshot);
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
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
