import React from 'react';
import { UseBehaviourProps } from './behaviour/types';
import { EmulatedReplayPreview } from './EmulatedReplayPreview';
import { Records } from './Records';
import { usePreviewSync } from './reusables/ConnectedPreview';
import { Screenshot } from './Screenshot';

export const Main: React.FC<UseBehaviourProps> = (props) => {
  const preview = usePreviewSync({
    identity: props.identity,
    onPreviewLoaded: props.onPreviewLoaded,
  });

  return render();

  function render() {
    if (props.selection.type === 'screenshot') {
      return (
        <Screenshot
          selection={props.selection}
          results={props.results}
          acceptScreenshot={props.acceptScreenshot}
        />
      );
    }

    if (props.selection.type === 'records') {
      return (
        <Records
          selection={props.selection}
          results={props.results}
          acceptRecords={props.acceptRecords}
        />
      );
    }

    return (
      <EmulatedReplayPreview
        {...preview}
        selection={props.selection}
        emulated={props.emulated}
        device={props.device}
      />
    );
  }
};
