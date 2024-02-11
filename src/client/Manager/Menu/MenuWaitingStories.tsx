import { Skeleton } from 'antd';
import React from 'react';

export const MenuWaitingStories: React.FC = () => (
  <>
      <Skeleton active style={{ padding: '0 10px' }} paragraph={{ rows: 5 }} />
      <Skeleton active style={{ padding: '0 10px' }} paragraph={{ rows: 2 }} />
  </>
);
