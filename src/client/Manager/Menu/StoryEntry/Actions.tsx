import React from 'react';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { Props } from './types';

export const Actions: React.FC<Props> = ({
  selection,
  story,
  results,
  run,
}) => {
  const comparison = results.get(story.id);

  if (comparison && comparison.running) {
    return renderWaiting();
  }

  if (selection.type !== 'story' || selection.story.id !== story.id) {
    return renderServerAction();
  }

  if (selection.playing) {
    return renderWaiting();
  }

  return renderServerAction();

  function renderWaiting() {
    return <LoadingOutlined style={{ fontSize: 20 }} />;
  }

  function renderServerAction() {
    return (
      <CameraOutlined
        style={{ fontSize: 20 }}
        onClick={(e) => {
          e.stopPropagation();

          run([story]);
        }}
      />
    );
  }
};
