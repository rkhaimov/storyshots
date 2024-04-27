import React, { PropsWithChildren, useEffect, useState } from 'react';
import { App } from '../../../../packages/preview/react/src/App';
import { Props } from './types';

export const IFrameEmulatedPreview: React.FC<Props & { hidden: boolean }> = (
  props,
) => {
  if (props.hidden) {
    return (
      <Delay>
        <div style={{ display: 'none' }}>
          <App {...props} />
        </div>
      </Delay>
    );
  }

  return (
    <Delay>
      <App {...props} />
    </Delay>
  );
};

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
