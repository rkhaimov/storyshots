import React, { useState } from 'react';
import styled from 'styled-components';
import ReactCompareImage from 'react-compare-image';
import { Radio, RadioChangeEvent } from 'antd';

type ViewerMode = '2up' | 'swipe';

const leftBorderColor = '#f77';
const sliderLineColor = '#acacac';
const rightBorderColor = '#63c363';

export const DiffImgViewer: React.FC<
  React.ComponentProps<typeof ReactCompareImage>
> = (props) => {
  const [mode, setMode] = useState<ViewerMode>('2up');

  function render2Up() {
    return (
      <>
        <Left>
          <Image src={props.leftImage} alt={props.leftImageAlt} />
        </Left>
        <Right>
          <Image src={props.rightImage} alt={props.rightImageAlt} />
        </Right>
      </>
    );
  }

  function renderSwipe() {
    return (
      <ReactCompareImage
        leftImageCss={{ border: `1px solid ${leftBorderColor}` }}
        rightImageCss={{ border: `1px solid ${rightBorderColor}` }}
        sliderLineColor={sliderLineColor}
        sliderLineWidth={1}
        handle={<></>}
        {...props}
      />
    );
  }

  return (
    <ViewerPanel>
      <Frame>
        {mode === '2up' && render2Up()}
        {mode === 'swipe' && renderSwipe()}
      </Frame>
      <Controls>
        <Radio.Group
          size="small"
          value={mode}
          onChange={(e: RadioChangeEvent) => setMode(e.target.value)}
        >
          <Radio.Button value="2up">2-up</Radio.Button>
          <Radio.Button value="swipe">Swipe</Radio.Button>
        </Radio.Group>
      </Controls>
    </ViewerPanel>
  );
};

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
  border: 1px solid ${leftBorderColor};
`;

const Right = styled.div`
  width: 50%;
  border: 1px solid ${rightBorderColor};
`;

const Image = styled.img`
  display: block;
  max-width: 100%;
  pointer-events: none;
`;
