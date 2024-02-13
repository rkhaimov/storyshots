import React from 'react';
import styled from 'styled-components';

type ViewType = 'pass' | 'fresh';

type Props = {
  type: ViewType;
  src: string;
  alt?: string;
};

export const ImgViewer: React.FC<Props> = (props) => {
  return (
    <ViewerPanel>
      <Frame>
        <Image src={props.src} alt={props.alt} $type={props.type} />
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

const Image = styled.img<{ $type: ViewType }>`
    display: block;
    margin: 0 auto;
    max-width: 100%;
    pointer-events: none;
    border: 1px solid ${({ $type }) => ($type === 'fresh' ? '#1677ff' : '#63c363')};
`;
