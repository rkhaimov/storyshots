import React from 'react';
import { FailedTestResult } from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from './types';

type Props = { results: FailedTestResult } & Pick<
  ParentProps,
  'story' | 'setError'
>;

export const ErrorsEntry: React.FC<Props> = ({ setError, story }) => {
  return <span onClick={() => setError(story)}>Error</span>;
};
