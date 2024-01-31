import React from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { UseBehaviourProps } from '../behaviour/types';
import { SelectionState } from '../behaviour/useSelection';

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
    return <span>Records are being generated</span>;
  }

  const records = results.records;

  if (records.type === 'fresh') {
    return (
      <>
        <button
          onClick={() =>
            acceptRecords(selection.story, records.actual, results)
          }
        >
          Accept
        </button>
        <span>FRESH</span>
        <ReactDiffViewer
          oldValue={JSON.stringify(records.actual, null, 2)}
          newValue={JSON.stringify(records.actual, null, 2)}
          showDiffOnly={false}
          splitView={false}
          hideLineNumbers={false}
        />
      </>
    );
  }

  if (records.type === 'pass') {
    return (
      <>
        <span>PASS</span>
        <ReactDiffViewer
          oldValue={JSON.stringify(records.actual, null, 2)}
          newValue={JSON.stringify(records.actual, null, 2)}
          showDiffOnly={false}
          splitView={false}
          hideLineNumbers={false}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => acceptRecords(selection.story, records.actual, results)}
      >
        Accept
      </button>
      <span>DIFF</span>
      <ReactDiffViewer
        oldValue={JSON.stringify(records.expected, null, 2)}
        newValue={JSON.stringify(records.actual, null, 2)}
        showDiffOnly={false}
        hideLineNumbers={false}
      />
    </>
  );
};
