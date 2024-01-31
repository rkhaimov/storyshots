import React from 'react';
import { SuccessTestResult } from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from './types';

type Props = { results: SuccessTestResult } & Pick<
  ParentProps,
  'setRecords' | 'story'
>;

export const RecordsEntry: React.FC<Props> = ({
  story,
  results,
  setRecords,
}) => {
  return <span onClick={() => setRecords(story)}>{results.records.type}</span>;
};
