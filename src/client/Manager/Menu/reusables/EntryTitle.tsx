import React, { CSSProperties } from 'react';
import styled from 'styled-components';

type Props = {
  title: string;
  left: React.ReactNode;
  style?: CSSProperties | undefined;
};

export const EntryTitle: React.FC<Props> = ({ title, left, style }) => (
  <Title title={title} style={style}>
    {left}
    {title}
  </Title>
);

const Title = styled.span`
  flex: 1 1 auto;
  user-select: none;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
