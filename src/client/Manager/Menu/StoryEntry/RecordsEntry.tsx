import { blue } from '@ant-design/colors';
import { ProfileOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import { Fail, Fresh, Pass } from '../../../reusables/Statuses';
import { SuccessTestResult } from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from './types';

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
      <RecordsHeader
        level={level}
        active={isActive()}
        onClick={() => setRecords(story)}
        style={{ background: isActive() ? blue[0] : '' }}
      >
        {renderType()}
        <RecordsTitle title="API Records">
          <ProfileOutlined />
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

  function isActive() {
    return selection.type === 'records' && selection.story.id === story.id;
  }
};

const RecordsHeader = styled.div.attrs<{ level: number; active: boolean }>(
  (props) => ({
    level: props.level,
    active: props.active,
  }),
)`
  height: 25px;
  display: flex;
  align-items: center;
  padding: 2px;
  padding-left: ${(props) => `${props.level * 40 + 8}px`};
  background: ${({ active }) => (active ? blue[0] : '')};
  transition: 0.2s ease-in-out;
  cursor: pointer;

  &:hover,
  &:focus {
    background: ${({ active }) => active ? blue[0] : '#fafafa'};
  }
`;

const RecordsTitle = styled.span`
  margin-left: 6px;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  & svg {
    margin-right: 4px;
  }
`;
