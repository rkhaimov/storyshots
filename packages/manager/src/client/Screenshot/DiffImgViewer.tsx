import { Radio, RadioChangeEvent } from 'antd';
import React, { useState } from 'react';
import ReactCompareImage from 'react-compare-image';
import styled from 'styled-components';
import { ScreenshotPath } from '../../reusables/types';
import { useDriver } from '../driver';

enum ViewerMode {
  TwoUp = 'twoup',
  Swipe = 'swipe',
}

type Props = {
  actual: ScreenshotPath;
  expected: ScreenshotPath;
};

export const DiffImgViewer: React.FC<Props> = (props) => {
  const driver = useDriver();
  const [mode, setMode] = useState<ViewerMode>(ViewerMode.TwoUp);

  function render2Up() {
    return (
      <>
        <Left>
          <Image src={driver.createScreenshotPath(props.actual)} alt="Actual" />
        </Left>
        <Right>
          <Image
            src={driver.createScreenshotPath(props.expected)}
            alt="Expected"
          />
        </Right>
      </>
    );
  }

  function renderSwipe() {
    return (
      <ReactCompareImage
        leftImageCss={{ border: `1px solid ${ACTUAL_BORDER_COLOR}` }}
        rightImageCss={{ border: `1px solid ${EXPECTED_BORDER_COLOR}` }}
        sliderLineColor={'#acacac'}
        sliderLineWidth={1}
        handle={<></>}
        leftImage={driver.createScreenshotPath(props.actual)}
        rightImage={driver.createScreenshotPath(props.expected)}
      />
    );
  }

  return (
    <ViewerPanel>
      <Frame>
        {mode === ViewerMode.TwoUp && render2Up()}
        {mode === ViewerMode.Swipe && renderSwipe()}
      </Frame>
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
  margin: 0 auto;
  padding: 30px;
  overflow: auto;
  width: calc(100% - 24px);
  background-color: #ececef;
  border: 1px solid #cecece;
  border-radius: 4px;
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
`;

const Frame = styled.div`
  display: flex;
  position: relative;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const Left = styled.div`
  width: 50%;
  border: 1px solid ${ACTUAL_BORDER_COLOR};
`;

const Right = styled.div`
  width: 50%;
  border: 1px solid ${EXPECTED_BORDER_COLOR};
`;

const Image = styled.img`
  display: block;
  max-width: 100%;
  pointer-events: none;
`;
