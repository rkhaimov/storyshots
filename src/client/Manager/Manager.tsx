import { Layout, theme } from 'antd';
import React from 'react';
import { useBehaviour } from './behaviour';
import { Menu } from './Menu';
import { Records } from './Records';
import { Screenshot } from './Screenshot';
import { Story } from './Story';
import { Props } from './types';

const { Sider } = Layout;

export const Manager: React.FC<Props> = (props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const behaviour = useBehaviour(props);

  return (
    <>
      <Layout hasSider style={{ height: '100%' }}>
        <Sider
          width={250}
          style={{
            background: colorBgContainer,
            overflowY: 'auto',
            borderRight: '1px solid #cecece',
          }}
        >
          <Menu {...behaviour} />
        </Sider>
        <main
          style={{
            width: '100%',
            backgroundColor: 'white',
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'relative',
          }}
        >
          <Story
            key={behaviour.preview.key}
            ref={behaviour.preview.ref}
            hidden={
              behaviour.selection.type === 'screenshot' ||
              behaviour.selection.type === 'records'
            }
          />
          {behaviour.selection.type === 'screenshot' && (
            <Screenshot
              selection={behaviour.selection}
              results={behaviour.results}
              acceptScreenshot={behaviour.acceptScreenshot}
            />
          )}
          {behaviour.selection.type === 'records' && (
            <Records
              selection={behaviour.selection}
              results={behaviour.results}
              acceptRecords={behaviour.acceptRecords}
            />
          )}
        </main>
      </Layout>
    </>
  );
};
