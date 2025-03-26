import { RightOutlined } from '@ant-design/icons';
import { List } from 'antd';
import React from 'react';
import { useLocation } from 'wouter';

export const Main = () => {
  const [, navigate] = useLocation();

  return (
    <List
      dataSource={[
        {
          title: 'Balance',
          description: 'Simple balance counter example',
          to: '/balance',
        },
        {
          title: 'CV',
          description: 'Complex cv example',
          to: '/cv',
        },
        {
          title: 'Clock',
          description: 'Timers example',
          to: '/clock',
        },
      ]}
      renderItem={({ title, description, to }) => (
        <List.Item
          actions={[
            <RightOutlined
              role="button"
              aria-label="Navigate"
              onClick={() => navigate(to)}
            />,
          ]}
        >
          <List.Item.Meta title={title} description={description} />
        </List.Item>
      )}
      style={{ padding: 20 }}
    />
  );
};
