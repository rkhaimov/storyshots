import React, { useRef } from 'react';
import { RouteComponentProps } from 'wouter';
import { Story } from './Story';

type Props = RouteComponentProps<{
  story: string;
}>;

export const ForChromiumOnly: React.FC<Props> = (props) => {
  const ref = useRef<HTMLIFrameElement>(null);

  return <Story ref={ref} hidden={false} />;
};
