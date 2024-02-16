import React, { useMemo } from 'react';
import { RouteComponentProps } from 'wouter';
import { Story } from './Story';
import { StoryID } from '../../reusables/types';

type Props = RouteComponentProps<{
  story: string;
}>;

export const ForChromiumOnly: React.FC<Props> = (props) => {
  useMemo(() => {
    window.setStoriesAndGetState = () => ({
      id: props.params.story as StoryID,
      screenshotting: true,
    });
  }, []);

  return <Story hidden={false} />;
};
