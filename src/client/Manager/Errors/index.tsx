import React from 'react';
import { SelectionState } from '../behaviour/useSelection';

type Props = {
  selection: Extract<SelectionState, { type: 'error' }>;
};

export const Errors: React.FC<Props> = ({ selection }) => {
  return <span>{selection.result.message}</span>;
};
