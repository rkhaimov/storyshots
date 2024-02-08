import React, { useEffect, useRef } from 'react';
import { RouteComponentProps } from 'wouter';
import { StoryID } from '../../reusables/types';
import { communicateWithPreview } from './behaviour/communicateWithPreview';
import { Story } from './Story';

type Props = RouteComponentProps<{
  story: string;
}>;

export const ForChromiumOnly: React.FC<Props> = (props) => {
  const id = props.params.story as StoryID;
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    communicateWithPreview(ref, id, true);
  }, []);

  return <Story ref={ref} hidden={false} />;
};
