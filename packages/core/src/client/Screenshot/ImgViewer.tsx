import React from 'react';
import styled from 'styled-components';

type ViewType = 'pass' | 'fresh' | 'fail';

type Props = {
  type: ViewType;
  src: string;
  alt?: string;
};

export const ImgViewer: React.FC<Props> = (props) => {
  return (
    <ViewerPanel>
      <Image src={props.src} alt={props.alt} $type={props.type} />
    </ViewerPanel>
  );
};

const ViewerPanel = styled.div`
  display: flex;
  margin: 0 12px;
  padding: 30px;
  height: 100%;
  background-color: #ececef;
  border: 1px solid #cecece;
  border-radius: 4px;
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
`;

export const Image = styled.img<{ $type: ViewType }>`
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  pointer-events: none;
  border: 1px solid ${({ $type }) => getViewTypeColor($type)};
`;

function getViewTypeColor(type: ViewType): string {
  switch (type) {
    case 'pass':
      return '#63c363';
    case 'fresh':
      return '#1677ff';
    case 'fail':
      return '#f5222d';
  }
}
