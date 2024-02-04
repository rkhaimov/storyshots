import React from 'react';
import { ErrorTestResult } from '../behaviour/useTestResults/types';

type Props = {
  result: ErrorTestResult;
};

export const Errors: React.FC<Props> = ({ result }) => {
  return <span>{result.message}</span>;
};
