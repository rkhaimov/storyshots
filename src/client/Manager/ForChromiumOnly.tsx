import React, { useMemo } from 'react';
import { RouteComponentProps } from 'wouter';

import { StoryID } from '../../reusables/types';
import { Story } from './Story';
import { TreeOP } from '../../reusables/tree';

type Props = RouteComponentProps<{
  story: string;
}>;

export const ForChromiumOnly: React.FC<Props> = (props) => {
  useMemo(() => {
    window.setStoriesAndGetState = () => ({
      id: TreeOP.ensureIsLeafID(props.params.story),
      screenshotting: true,
    });
  }, []);

  return <Story hidden={false} />;
};
