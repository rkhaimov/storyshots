import { List } from 'antd';
import React from 'react';
import { useLocation } from 'wouter';

export const Main = () => {
  const [, navigate] = useLocation();

  return (
    <List
      dataSource={[
        {
          title: 'Wow',
          description: 'Simple balance counter example',
          to: '/balance',
        },
        {
          title: 'CV',
          description: 'Complex cv example',
          to: '/cv',
        },
      ]}
      renderItem={({ title, description }) => (
        <List.Item actions={[]}>
          <List.Item.Meta title={title} description={description} />
        </List.Item>
      )}
      style={{ padding: 20 }}
    />
  );
};
