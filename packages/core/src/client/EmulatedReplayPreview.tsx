import React from 'react';
import { UseBehaviourProps } from './behaviour/types';
import {
  RecordsSelection,
  ScreenshotSelection,
} from './behaviour/useSelection/types';
import { Preview } from './reusables/ConnectedPreview';

type Props = Omit<ReplayPreviewProps, 'style'> &
  Pick<UseBehaviourProps, 'emulated' | 'device'>;

export const EmulatedReplayPreview: React.FC<Props> = (props) => {
  const { selection } = props;

  if (selection.type === 'initializing' || !props.emulated) {
    return <ReplayPreview {...props} />;
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <ReplayPreview
        {...props}
        style={{
          width: `${props.device.preview.width}px`,
          height: `${props.device.preview.height}px`,
          margin: 'auto',
          border: '1px solid rgb(206, 206, 206)',
        }}
      />
    </div>
  );
};

type ReplayPreviewProps = React.ComponentProps<typeof Preview> & {
  selection: Exclude<
    UseBehaviourProps['selection'],
    ScreenshotSelection | RecordsSelection
  >;
};
export const ReplayPreview: React.FC<ReplayPreviewProps> = ({
  selection,
  identity,
  ...props
}) => {
  const key = selection.type === 'story' ? selection.selectedAt : '';

  return <Preview identity={`${identity}${key}`} {...props} />;
};
