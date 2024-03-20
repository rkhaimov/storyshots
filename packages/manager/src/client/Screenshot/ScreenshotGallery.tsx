import React, { useState } from 'react';
import styled from 'styled-components';
import { Image } from './ImgViewer';
import { useDriver } from '../driver';
import {
  SingleConfigScreenshotResult,
  SuccessTestResult,
} from '../behaviour/useTestResults/types';
import { PureStory, ScreenshotName, isNil } from '@storyshots/core';
import { UseBehaviourProps } from '../behaviour/types';
import { SingleScreenshot } from './SingleScreenshot';
import { presetsToString } from './utils';

type Props = {
  name: ScreenshotName | undefined;
  story: PureStory;
  screenshots: SingleConfigScreenshotResult[];
  result: SuccessTestResult;
} & Pick<UseBehaviourProps, 'acceptScreenshot'>;

export const ScreenshotGallery: React.FC<Props> = ({
  name,
  story,
  screenshots,
  result,
  acceptScreenshot,
}) => {
  const driver = useDriver();
  const [currentScreenshot, setScreenshot] =
    useState<SingleConfigScreenshotResult | null>(null);

  if (!isNil(currentScreenshot)) {
    return (
      <SingleScreenshot
        name={name}
        screenshot={currentScreenshot}
        story={story}
        acceptScreenshot={acceptScreenshot}
        onBack={() => setScreenshot(null)}
        results={result}
      />
    );
  }

  return (
    <Wrapper>
      {screenshots.map((screenshot) => {
        const name = `${screenshot.device.name} — ${presetsToString(
          screenshot.presets,
        )}`;

        return (
          <GalleryItem
            key={screenshot.result.actual}
            onClick={() => {
              setScreenshot(screenshot);
            }}
          >
            <GalleryImage
              $type={screenshot.result.type}
              alt={name}
              src={driver.createScreenshotPath(screenshot.result.actual)}
            />
            <span>{name}</span>
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
