import {
  assertNotEmpty,
  Channel,
  createJournal,
  Device,
  JournalStoryConfig,
  PreviewConfig,
  StoryID,
  TreeOP,
} from '@storyshots/core';
import React from 'react';
import { PreviewProps } from './types';

type Props = { id: StoryID; preview: PreviewProps; config: PreviewConfig };

export const Story: React.FC<Props> = (props) => {
  const story = createStoryNode(props);

  if (!props.config.emulated) {
    return story;
  }

  return <Emulated {...props}>{story}</Emulated>;
};

const Emulated: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const device = props.config.device ?? (props.preview.devices as Device[])[0];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div
        style={{
          height: device.config.height,
          width: device.config.width,
          margin: 'auto',
          border: '1px solid rgb(206, 206, 206)',
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

function createStoryNode({
  id,
  preview,
  config: { device, screenshotting },
}: Props) {
  const { createExternals, createJournalExternals, stories } = preview;

  const config: JournalStoryConfig = {
    device: device ?? (preview.devices as Device[])[0],
    screenshotting,
    journal: createJournal(),
  };

  const story = TreeOP.find(stories, id);

  assertNotEmpty(story);

  const externals = story.payload.arrange(createExternals(config), config);

  setRecordsSource(config.journal.read);

  return story.payload.render(
    createJournalExternals(externals, config),
    config,
  );
}

function setRecordsSource(records: Channel['records']): void {
  (window as never as Channel).records = records;
}
