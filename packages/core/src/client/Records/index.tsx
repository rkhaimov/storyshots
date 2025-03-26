import { isNil } from '@lib';
import React from 'react';
import { UseBehaviourProps } from '../behaviour/types';
import { RecordsSelection } from '../behaviour/useSelection/types';
import { Spinner } from '../reusables/Spinner';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Accept';
import { DiffReader } from './DiffReader';

type Props = {
  selection: RecordsSelection;
} & Pick<UseBehaviourProps, 'acceptRecords' | 'results'>;

export const Records: React.FC<Props> = ({
  selection,
  results,
  acceptRecords,
}) => {
  const result = results.get(selection.story.id)?.get(selection.device);

  if (isNil(result)) {
    return <span>Records are not generated yet, for given device</span>;
  }

  if (result.type === 'running' || result.type === 'scheduled') {
    return <Spinner />;
  }

  if (result.details.type === 'error') {
    return (
      <span>Error has been caught during last run. Check the errors pane.</span>
    );
  }

  const { records } = result.details.data;
  const title = `[${selection.device.name}] ${selection.story.title}`;

  if (records.type === 'fresh') {
    return (
      <Workspace
        title={title}
        actions={
          <ActionAccept
            onAction={() =>
              acceptRecords(selection.story.id, selection.device, records)
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
            acceptRecords(selection.story.id, selection.device, records)
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
