import { SuccessTestResult } from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from '../types';
import { PureStory } from '@storyshots/core';

export type Props = ParentProps & {
  story: PureStory;
};

export type ResultKindComponentProps = { results: SuccessTestResult } & Pick<
  Props,
  'setRecords' | 'story'
>;
