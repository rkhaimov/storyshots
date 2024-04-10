import { Button } from 'antd';
import React from 'react';

type Props = {
  label: string;
  icon: React.ReactNode;
  action?: React.MouseEventHandler<HTMLElement>;
};

export const EntryAction: React.FC<Props> = ({ label, action, icon }) => (
  <Button
    size="small"
    type="text"
    onClick={action}
    icon={icon}
    title={label}
    aria-label={label}
  />
);
