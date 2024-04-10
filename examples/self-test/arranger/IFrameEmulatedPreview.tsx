import React, { PropsWithChildren, useEffect, useState } from 'react';
import { App } from '../../../packages/preview/react/src/App';

type Props = React.ComponentProps<typeof App> & { hidden: boolean };

export const IFrameEmulatedPreview: React.FC<Props> = (props) => (
  <Delay>
    <div style={{ display: props.hidden ? 'none' : 'initial' }}>
      <App {...props} />
    </div>
  </Delay>
);

const Delay: React.FC<PropsWithChildren> = ({ children }) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDone(true), 0);

    return () => clearTimeout(id);
  }, []);

  if (done) {
    return children;
  }

  return null;
};
