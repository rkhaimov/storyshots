import React, { useMemo } from 'react';
import { RouteComponentProps } from 'wouter';
import { TreeOP } from '../../reusables/tree';
import { Story } from './Story';

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
