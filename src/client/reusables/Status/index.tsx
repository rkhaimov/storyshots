import React from 'react';
import { Default } from './Default';
import { Fresh } from './Fresh';
import { Fail } from './Fail';
import { Pass } from './Pass';
import { Error } from './Error';
import { StatusType } from './types';

export const Status: React.FC<{ type: StatusType }> = (props) => {
  if (props.type === 'pass') {
    return <Pass />;
  }

  if (props.type === 'fail') {
    return <Fail />;
  }

  if (props.type === 'fresh') {
    return <Fresh />;
  }

  if (props.type === 'error') {
    return <Error />;
  }

  return <Default />;
};

export { getGroupStatus, getStoryStatus } from './getStatus';
