import { blue } from '@ant-design/colors';
import React from 'react';
import { ErrorTestResult } from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from './types';

type Props = { results: ErrorTestResult } & Pick<
  ParentProps,
  'story' | 'setRecords' | 'selection'
>;

export const ErrorsEntry: React.FC<Props> = ({
  setRecords,
  story,
  selection,
}) => {
  return (
    <span
      style={{ background: isActive() ? blue[0] : '' }}
      onClick={() => setRecords(story)}
    >
      ERROR
    </span>
  );

  function isActive() {
    return (
      (selection.type === 'records' || selection.type === 'screenshot') &&
      selection.story.id === story.id
    );
  }
};
