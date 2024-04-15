import React from 'react';
import { useExternals } from './externals/context';

export const PreviewFrame: React.FC<{ hidden: boolean }> = ({ hidden }) => {
  const { preview } = useExternals();

  return (
    <preview.Frame id="preview" src="http://localhost:6006" hidden={hidden} />
  );
};
