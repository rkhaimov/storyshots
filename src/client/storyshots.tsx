import React from 'react';
import { Layout, theme } from 'antd';
import { Node } from './types';
import { useStoryBehaviour } from './useStoryBehaviour';
import { Menu } from './menu';

const { Sider } = Layout;

type Props = { stories: Node[] };

export const Storyshots: React.ComponentType<Props> = ({ stories }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { setStory, story } = useStoryBehaviour();

  return (
    <>
      <Layout hasSider style={{ height: '100%' }}>
        <Sider style={{ background: colorBgContainer }}>
          <Menu stories={stories} setStory={setStory} story={story} />
        </Sider>
        <main style={{ width: '100%', backgroundColor: 'white' }}>
          {story === undefined ? <h1>Select a story</h1> : story.render()}
        </main>
      </Layout>
    </>
  );
};
