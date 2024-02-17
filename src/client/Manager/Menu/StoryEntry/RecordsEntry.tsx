import { blue } from '@ant-design/colors';
import { ProfileOutlined } from '@ant-design/icons';
import React from 'react';
import { SuccessTestResult } from '../../behaviour/useTestResults/types';
import { ActiveEntryHeader } from '../reusables/EntryHeader';
import { EntryStatus } from '../reusables/EntryStatus';
import { EntryTitle } from '../reusables/EntryTitle';
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
      <ActiveEntryHeader
        $level={level}
        $offset={24}
        $active={isActive()}
        $color={blue[0]}
        onClick={() => setRecords(story.id)}
      >
        <EntryTitle
          left={
            <>
              <EntryStatus status={{ type: results.records.type }} />
              <ProfileOutlined style={{ marginRight: 4 }} />
            </>
          }
          title="Records"
        />
      </ActiveEntryHeader>
    </>
  );

  function isActive() {
    return selection.type === 'records' && selection.story.id === story.id;
  }
};
