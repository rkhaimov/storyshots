import React from 'react';
import { UseBehaviourProps } from '../behaviour/types';
import { Spinner } from '../reusables/Spinner';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Accept';
import { DiffReader } from './DiffReader';
import { isNil } from '@storyshots/core';

type RecordsSelection = Extract<
  UseBehaviourProps['selection'],
  {
    type: 'records';
  }
>;

type Props = {
  selection: RecordsSelection;
} & Pick<UseBehaviourProps, 'acceptRecords' | 'results'>;

export const Records: React.FC<Props> = ({
  selection,
  results,
  acceptRecords,
}) => {
  const result = results.get(selection.story.id);
  const title = `${selection.story.payload.title} — Records`;

  if (isNil(result)) {
    return <span>Records are not generated yet</span>;
  }

  if (result.running) {
    return <Spinner />;
  }

  if (result.type === 'error') {
    return (
      <span>Error has been caught during last run. Check the errors pane.</span>
    );
  }

  const records = result.records;

  if (records.type === 'fresh') {
    return (
      <Workspace
        title={title}
        actions={
          <ActionAccept
            onAction={() =>
              acceptRecords(selection.story, records.actual, result)
            }
          />
        }
      >
        <DiffReader
          oldValue={JSON.stringify(records.actual, null, 2)}
          newValue={JSON.stringify(records.actual, null, 2)}
          showDiffOnly={false}
          splitView={false}
          hideLineNumbers={false}
          single
        />
      </Workspace>
    );
  }

  if (records.type === 'pass') {
    return (
      <Workspace title={title}>
        <DiffReader
          oldValue={JSON.stringify(records.actual, null, 2)}
          newValue={JSON.stringify(records.actual, null, 2)}
          showDiffOnly={false}
          splitView={false}
          hideLineNumbers={false}
          single
        />
      </Workspace>
    );
  }

  return (
    <Workspace
      title={title}
      actions={
        <ActionAccept
          onAction={() =>
            acceptRecords(selection.story, records.actual, result)
          }
        />
      }
    >
      <DiffReader
        oldValue={JSON.stringify(records.expected, null, 2)}
        newValue={JSON.stringify(records.actual, null, 2)}
        showDiffOnly={false}
        hideLineNumbers={false}
      />
    </Workspace>
  );
};
