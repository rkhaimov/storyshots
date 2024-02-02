import React from 'react';
import styled from 'styled-components';
import { blue } from '@ant-design/colors';
import { ProfileOutlined } from '@ant-design/icons';
import { Fail, Fresh, Pass } from '../../../reusables/Statuses';
import { isActiveLink } from '../isActiveLink';
import { SuccessTestResult } from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from './types';

type Props = { results: SuccessTestResult } & Pick<
  ParentProps,
  'setRecords' | 'story' | 'level'
>;

export const RecordsEntry: React.FC<Props> = ({
  story,
  level,
  results,
  setRecords,
}) => {
  const isActive = isActiveLink('records', story.id);

  return (
    <>
      <RecordsHeader
        level={level}
        onClick={() => setRecords(story)}
        style={{ background: isActive ? blue[0] : '' }}
      >
        {renderType()}
        <RecordsTitle title="API Records">
          <ProfileOutlined style={{ marginRight: 4 }} />
          Records
        </RecordsTitle>
      </RecordsHeader>
    </>
  );

  function renderType() {
    if (results.records.type === 'fail') {
      return <Fail />;
    }

    if (results.records.type === 'fresh') {
      return <Fresh />;
    }

    return <Pass />;
  }
};

const RecordsHeader = styled.div.attrs<{ level: number }>((props) => ({
  level: props.level,
}))`
  height: 25px;
  display: flex;
  align-items: center;
  padding: 2px;
  padding-left: ${(props) => `${props.level * 40 + 8}px`};
  transition: 0.2s ease-in-out;
  cursor: pointer;

  &:hover,
  &:focus {
    background: #fafafa;
  }
`;

const RecordsTitle = styled.span`
  margin-left: 6px;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
