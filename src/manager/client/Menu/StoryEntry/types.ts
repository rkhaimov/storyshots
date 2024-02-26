import { PureStory } from '../../../../reusables/story';
import { SuccessTestResult } from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from '../types';

export type Props = ParentProps & {
  story: PureStory;
};

export type ResultKindComponentProps = { results: SuccessTestResult } & Pick<
  Props,
  'setRecords' | 'story'
>;
