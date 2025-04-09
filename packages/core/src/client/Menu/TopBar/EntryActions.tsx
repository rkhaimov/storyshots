import React from 'react';
import styled from 'styled-components';
import { Summary } from '../../../reusables/summary/types';

type Props = React.PropsWithChildren<{
  className?: string;
}>;

const _EntryActions: React.FC<Props> = (props) => {
  return <div className={props.className}>{props.children}</div>;
};

export const EntryActions = styled(_EntryActions)`
  display: flex;
  gap: 4px;
`;

export const IdleActions: React.FC<
  React.PropsWithChildren & { summary: Summary }
> = ({ children, summary }) => {
  if (summary.running === 0) {
    return children;
  }

  return;
};
