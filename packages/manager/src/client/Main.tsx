import React from 'react';
import { Screenshot } from './Screenshot';
import { Records } from './Records';
import { UseBehaviourProps } from './behaviour/types';
import { usePreviewConnection } from './reusables/ConnectedPreview';
import { EmulatedReplayPreview } from './EmulatedReplayPreview';
import { createPreviewConfig } from './behaviour/useSelection/createPreviewConfig';

export const Main: React.FC<UseBehaviourProps> = (props) => {
  const preview = usePreviewConnection({
    config: createPreviewConfig(props.selection),
    onStateChange: props.onStateChange,
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

    return <EmulatedReplayPreview {...preview} selection={props.selection} />;
  }
};
