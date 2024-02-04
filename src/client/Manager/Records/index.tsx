import React from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { Spinner } from '../../reusables/Spinner';
import { UseBehaviourProps } from '../behaviour/types';
import { SelectionState } from '../behaviour/useSelection';
import { Workspace } from '../Workspace';

type RecordsSelection = Extract<
  SelectionState,
  {
    type: 'records';
  }
>;

type Props = {
  selection: RecordsSelection;
} & Pick<UseBehaviourProps, 'acceptRecords'>;

export const Records: React.FC<Props> = ({ selection, acceptRecords }) => {
  const results = selection.result;

  if (results.running) {
    return <Spinner.AbsoluteStretched />;
  }

  const records = results.records;

  if (records.type === 'fresh') {
    return (
      <Workspace
        actions={
          <button
            onClick={() =>
              acceptRecords(selection.story, records.actual, results)
            }
          >
            Accept
          </button>
        }
      >
        <Workspace.CodeReader>
          <ReactDiffViewer
            oldValue={JSON.stringify(records.actual, null, 2)}
            newValue={JSON.stringify(records.actual, null, 2)}
            showDiffOnly={false}
            splitView={false}
            hideLineNumbers={false}
          />
        </Workspace.CodeReader>
      </Workspace>
    );
  }

  if (records.type === 'pass') {
    return (
      <Workspace>
        <Workspace.CodeReader>
          <ReactDiffViewer
            oldValue={JSON.stringify(records.actual, null, 2)}
            newValue={JSON.stringify(records.actual, null, 2)}
            showDiffOnly={false}
            splitView={false}
            hideLineNumbers={false}
          />
        </Workspace.CodeReader>
      </Workspace>
    );
  }

  return (
    <Workspace
      actions={
        <button
          onClick={() =>
            acceptRecords(selection.story, records.actual, results)
          }
        >
          Accept
        </button>
      }
    >
      <Workspace.CodeReader>
        <ReactDiffViewer
          oldValue={JSON.stringify(records.expected, null, 2)}
          newValue={JSON.stringify(records.actual, null, 2)}
          showDiffOnly={false}
          hideLineNumbers={false}
        />
      </Workspace.CodeReader>
    </Workspace>
  );
};
