import { blue } from '@ant-design/colors';
import React from 'react';
import { ErrorTestResult } from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from './types';
import { Status } from '../../../reusables/Status';
import { Title } from './styled/Title';
import { Header } from './styled/Header';

type Props = { results: ErrorTestResult } & Pick<
  ParentProps,
  'story' | 'setRecords' | 'selection' | 'level'
>;

export const ErrorsEntry: React.FC<Props> = ({
  setRecords,
  story,
  selection,
  level,
}) => {
  return (
    <Header
      level={level}
      levelMargin={24}
      active={isActive()}
      activeColor={blue[0]}
      onClick={() => setRecords(story)}
    >
      <Title>
        <Status type="error" />
        <span style={{ color: '#f77' }}>ERROR</span>
      </Title>
    </Header>
  );

  function isActive() {
    return (
      (selection.type === 'records' || selection.type === 'screenshot') &&
      selection.story.id === story.id
    );
  }
};
