import { EvaluatedStory } from '../../../reusables/channel';
import { SuccessTestResult } from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from '../types';

export type Props = ParentProps & {
  story: EvaluatedStory;
};

export type ResultKindComponentProps = { results: SuccessTestResult } & Pick<
  Props,
  'setRecords' | 'story'
>;
