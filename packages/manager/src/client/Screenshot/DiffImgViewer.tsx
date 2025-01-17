import { Radio, RadioChangeEvent } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ScreenshotPath } from '../../reusables/types';
import { driver } from '../../reusables/runner/driver';
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from 'react-compare-slider';
import { Device, isNil } from '@storyshots/core';

enum ViewerMode {
  TwoUp = 'twoup',
  Swipe = 'swipe',
}

type Props = {
  device: Device;
  actual: ScreenshotPath;
  expected: ScreenshotPath;
};

export const DiffImgViewer: React.FC<Props> = (props) => {
  const [mode, setMode] = useState(
    props.device.config.width > props.device.config.height
      ? ViewerMode.Swipe
      : ViewerMode.TwoUp,
  );

  function renderTwoUp() {
    return (
      <TwoUp>
        <ActualImage
          src={driver.createScreenshotPath(props.actual)}
          alt="Actual"
        />
        <ExpectedImage
          src={driver.createScreenshotPath(props.expected)}
          alt="Expected"
        />
      </TwoUp>
    );
  }

  function renderSwipe() {
    return (
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={driver.createScreenshotPath(props.actual)}
            style={{
              border: `1px solid ${ACTUAL_BORDER_COLOR}`,
              width: 'unset',
              height: 'unset',
              maxHeight: '100%',
              maxWidth: '100%',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={driver.createScreenshotPath(props.expected)}
            style={{
              border: `1px solid ${EXPECTED_BORDER_COLOR}`,
              width: 'unset',
              height: 'unset',
              maxHeight: '100%',
              maxWidth: '100%',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        }
        handle={
          <ReactCompareSliderHandle
            buttonStyle={{ display: 'none' }}
            linesStyle={{ backgroundColor: '#acacac' }}
          />
        }
        style={{
          display: 'unset',
          height: 'calc(100% - 24px)',
        }}
      />
    );
  }

  return (
    <ViewerPanel>
      {mode === ViewerMode.TwoUp && renderTwoUp()}
      {mode === ViewerMode.Swipe && renderSwipe()}
      <Controls>
        <Radio.Group
          size="small"
          value={mode}
          onChange={(e: RadioChangeEvent) => setMode(e.target.value)}
        >
          <Radio.Button value={ViewerMode.TwoUp}>2-up</Radio.Button>
          <Radio.Button value={ViewerMode.Swipe}>Swipe</Radio.Button>
        </Radio.Group>
      </Controls>
    </ViewerPanel>
  );
};

const ACTUAL_BORDER_COLOR = '#1677ff';
const EXPECTED_BORDER_COLOR = '#63c363';

const ViewerPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 12px;
  padding: 30px;
  height: 100%;
  background-color: #ececef;
  border: 1px solid #cecece;
  border-radius: 4px;
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
`;

const TwoUp = styled.div`
  display: flex;
  height: calc(100% - 24px);
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  height: 24px;
`;

const ActualImage = styled.img`
  max-height: 100%;
  max-width: 50%;
  pointer-events: none;
  border: 1px solid ${ACTUAL_BORDER_COLOR};
`;

const ExpectedImage = styled.img`
  max-height: 100%;
  max-width: 50%;
  pointer-events: none;
  border: 1px solid ${EXPECTED_BORDER_COLOR};
`;
