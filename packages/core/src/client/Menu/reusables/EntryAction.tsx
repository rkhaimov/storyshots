import { Button } from 'antd';
import React from 'react';

type Props = {
  label: string;
  icon: React.ReactNode;
  action?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
};

export const EntryAction: React.FC<Props> = ({
  label,
  action,
  icon,
  disabled,
}) => (
  <Button
    size="small"
    type="text"
    onClick={action}
    icon={icon}
    title={label}
    aria-label={label}
    disabled={disabled}
  />
);
