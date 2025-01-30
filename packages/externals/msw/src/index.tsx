import { setupWorker } from 'msw/browser';
import type React from 'react';
import { useEffect, useState } from 'react';

type Props = {
  handlers: Parameters<typeof setupWorker>;
};

export const MSWReplacer: React.FC<React.PropsWithChildren<Props>> = ({
  handlers,
  children,
}) => {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    void setupWorker(...handlers)
      .start()
      .then(() => setInitializing(false));
  }, []);

  if (initializing) {
    return null;
  }

  return children;
};
