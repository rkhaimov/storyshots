import { PureStory, ScreenshotName } from '@storyshots/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import { UseBehaviourProps } from '../behaviour/types';
import {
  PresetScreenshotResult,
  TestResultDetails,
} from '../behaviour/useTestResults/types';
import { useExternals } from '../externals/context';
import { Image } from './ImgViewer';
import { SingleScreenshot } from './SingleScreenshot';

type Props = {
  name: ScreenshotName;
  story: PureStory;
  screenshots: PresetScreenshotResult[];
  details: TestResultDetails;
} & Pick<UseBehaviourProps, 'acceptScreenshot'>;

export const ScreenshotGallery: React.FC<Props> = ({
  name,
  story,
  screenshots,
  details,
  acceptScreenshot,
}) => {
  const { driver } = useExternals();
  const [active, setScreenshot] = useState<PresetScreenshotResult>();

  if (active) {
    return (
      <SingleScreenshot
        name={name}
        screenshot={active}
        story={story}
        acceptScreenshot={acceptScreenshot}
        onBack={() => setScreenshot(undefined)}
        details={details}
      />
    );
  }

  return (
    <Gallery>
      {screenshots.map((screenshot) => {
        const name = Object.entries(screenshot.presets)
          .map(([name, value]) => `${name}-${value}`)
          .join('__');

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
    </Gallery>
  );
};

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: minmax(0, 300px);
  padding: 20px;
  gap: 20px;
`;

const GalleryItem = styled.div`
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
