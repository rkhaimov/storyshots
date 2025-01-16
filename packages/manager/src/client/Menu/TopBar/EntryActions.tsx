import styled from 'styled-components';
import React from 'react';

type Props = React.PropsWithChildren<{
  className?: string;
  onRunNode?: React.ReactNode;
}>;

const _EntryActions: React.FC<Props> = (props) => {
  if (props.onRunNode) {
    return props.onRunNode;
  }

  return <div className={props.className}>{props.children}</div>;
};

export const EntryActions = styled(_EntryActions)`
  display: flex;
  gap: 4px;
`;
