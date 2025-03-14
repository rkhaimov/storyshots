import React from 'react';

export const Diagram: React.FC<{ src: { default: string } }> = ({ src }) => (
  <img src={src.default} style={{ border: '10px solid #fff' }} />
);
