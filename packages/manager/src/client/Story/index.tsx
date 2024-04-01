import React from 'react';
import { useExternals } from '../externals/context';

type Props = {
  hidden?: boolean;
};

export const Story: React.FC<Props> = (props) => {
  const { preview } = useExternals();
  const Frame = preview.Frame;

  return (
    <Frame
      id="preview"
      src="http://localhost:6006"
      style={{
        display: 'block',
        height: props.hidden ? 0 : '100%',
        width: props.hidden ? 0 : '100%',
        border: 'none',
      }}
    />
  );
};
