import React from 'react';

type Props = {
  identity: string;
};

export const Preview: React.FC<Props> = (props) => (
  <iframe
    key={props.identity}
    id="preview"
    src={location.origin}
    style={{
      display: 'block',
      border: 'none',
      height: '100%',
      width: '100%',
    }}
  />
);
