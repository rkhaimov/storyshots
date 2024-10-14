import React from 'react';
import { Screenshot } from './Screenshot';
import { Records } from './Records';
import { UseBehaviourProps } from './behaviour/types';
import { createPreviewFrame } from './reusables/PreviewFrame';

export const Main: React.FC<UseBehaviourProps> = (props) => {
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
      <PreviewFrame
        config={props.preview}
        onStateChange={props.onStateChange}
      />
    );
  }
};

const PreviewFrame = createPreviewFrame();
