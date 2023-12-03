import React, { forwardRef } from 'react';

type Props = {
  hidden?: boolean;
};

export const Story = forwardRef<HTMLIFrameElement, Props>((props, ref) => (
  <iframe
    id="preview"
    ref={ref}
    src="http://localhost:3030"
    style={{
      display: 'block',
      height: props.hidden ? 0 : '100%',
      width: props.hidden ? 0 : '100%',
      border: 'none',
    }}
  />
));

Story.displayName = 'Story';
