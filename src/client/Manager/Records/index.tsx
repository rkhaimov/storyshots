import React from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { SelectionState } from '../behaviour/useSelection';
import { isNil } from '../../../reusables/utils';
import { UseBehaviourProps } from '../behaviour/types';

type RecordsSelection = Extract<
  SelectionState,
  {
    type: 'records';
  }
>;

type Props = {
  selection: RecordsSelection;
} & Pick<UseBehaviourProps, 'results' | 'acceptRecords'>;

export const Records: React.FC<Props> = ({
  selection,
  results,
  acceptRecords,
}) => {
  const storyResults = results.get(selection.story.id);

  if (isNil(storyResults)) {
    return <span>Records are not generated yet</span>;
  }

  if (storyResults.running) {
    return <span>Records are being generated</span>;
  }

  const records = storyResults.records;

  if (records.type === 'fresh') {
    return (
      <>
        <button
          onClick={() =>
            acceptRecords(selection.story, records.actual, storyResults)
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
        onClick={() =>
          acceptRecords(selection.story, records.actual, storyResults)
        }
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
