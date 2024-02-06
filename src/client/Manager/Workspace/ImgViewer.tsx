import React from 'react';
import styled from 'styled-components';

export const ImgViewer: React.FC<{ src: string; alt?: string }> = (props) => {
  return (
    <ViewerPanel>
      <Frame>
        <Image src={props.src} alt={props.alt} />
      </Frame>
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
  position: relative;
`;

const Image = styled.img`
  display: block;
  margin: 0 auto;
  max-width: 100%;
  pointer-events: none;
  border: 1px solid #1677ff;
`;
