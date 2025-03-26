import { blue } from '@ant-design/colors';
import { ProfileOutlined } from '@ant-design/icons';
import React from 'react';
import { ActiveEntryHeader } from '../reusables/EntryHeader';
import { HighlightableEntry } from '../reusables/HighlightableEntry';
import { DeviceToTestRunResult, Props as ParentProps } from './types';

type Props = { result: DeviceToTestRunResult } & Pick<
  ParentProps,
  'setRecords' | 'story' | 'level' | 'selection'
>;

export const RecordsEntry: React.FC<Props> = ({
  story,
  level,
  result,
  selection,
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
        onClick={() => setRecords(story.id, result.device.name)}
      >
        <HighlightableEntry
          title="Records"
          left={<ProfileOutlined style={{ marginRight: 4 }} />}
          status={result.details.records.type}
        />
      </ActiveEntryHeader>
    </>
  );

  function isActive() {
    return (
      selection.type === 'records' &&
      selection.story.id === story.id &&
      selection.device === result.device
    );
  }
};
