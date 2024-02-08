import { blue } from '@ant-design/colors';
import { ProfileOutlined } from '@ant-design/icons';
import React from 'react';
import { Status } from '../../../reusables/Status';
import { SuccessTestResult } from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from './types';
import { Title } from '../../../reusables/Menu/styled/Title';
import { Header } from '../../../reusables/Menu/styled/Header';

type Props = { results: SuccessTestResult } & Pick<
  ParentProps,
  'setRecords' | 'story' | 'level' | 'selection'
>;

export const RecordsEntry: React.FC<Props> = ({
  story,
  selection,
  level,
  results,
  setRecords,
}) => {
  return (
    <>
      <Header
        level={level}
        levelMargin={24}
        active={isActive()}
        activeColor={blue[0]}
        onClick={() => setRecords(story)}
      >
        <Title title="API Records">
          <Status type={results.records.type} />
          <ProfileOutlined />
          Records
        </Title>
      </Header>
    </>
  );

  function isActive() {
    return selection.type === 'records' && selection.story.id === story.id;
  }
};
