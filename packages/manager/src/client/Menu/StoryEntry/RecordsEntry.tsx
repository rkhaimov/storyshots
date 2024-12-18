import { blue } from '@ant-design/colors';
import { ProfileOutlined } from '@ant-design/icons';
import React from 'react';
import { TestResultDetails } from '../../../reusables/runner/types';
import { ActiveEntryHeader } from '../reusables/EntryHeader';
import { HighlightableEntry } from '../reusables/EntryStatus';
import { Props as ParentProps } from './types';

type Props = { details: TestResultDetails } & Pick<
  ParentProps,
  'setRecords' | 'story' | 'level' | 'selection'
>;

export const RecordsEntry: React.FC<Props> = ({
  story,
  selection,
  level,
  details,
  setRecords,
}) => {
  return (
    <>
      <ActiveEntryHeader
        $level={level}
        $offset={24}
        $active={isActive()}
        $color={blue[0]}
        role="menuitem"
        aria-label="Records"
        onClick={() => setRecords(story.id, details.device.name)}
      >
        <HighlightableEntry
          title="Records"
          left={<ProfileOutlined style={{ marginRight: 4 }} />}
          status={details.records.type}
        />
      </ActiveEntryHeader>
    </>
  );

  function isActive() {
    return (
      selection.type === 'records' &&
      selection.story.id === story.id &&
      selection.device === details.device.name
    );
  }
};
