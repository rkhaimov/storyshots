import React from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { isNil } from '../../../reusables/utils';
import { Spinner } from '../../reusables/Spinner';
import { UseBehaviourProps } from '../behaviour/types';
import { SelectionState } from '../behaviour/useSelection';
import { Errors } from '../Errors';
import { Workspace } from '../Workspace';

type RecordsSelection = Extract<
  SelectionState,
  {
    type: 'records';
  }
>;

type Props = {
  selection: RecordsSelection;
} & Pick<UseBehaviourProps, 'acceptRecords' | 'results'>;

export const RecordsOrErrors: React.FC<Props> = ({
  selection,
  results,
  acceptRecords,
}) => {
  const result = results.get(selection.story.id);

  if (isNil(result)) {
    return <span>Records are not generated yet</span>;
  }

  if (result.running) {
    return <Spinner.AbsoluteStretched />;
  }

  if (result.type === 'error') {
    return <Errors result={result} />;
  }

  const records = result.records;

  if (records.type === 'fresh') {
    return (
      <Workspace
        actions={
          <button
            onClick={() =>
              acceptRecords(selection.story, records.actual, result)
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
          onClick={() => acceptRecords(selection.story, records.actual, result)}
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
