import React from 'react';
import { Errors } from './Errors';
import { Props } from './types';
import { Layout, theme } from 'antd';
import { useBehaviour } from './behaviour';
import { Menu } from './Menu';
import { Story } from './Story';
import { Screenshot } from './Screenshot';
import { Records } from './Records';

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
        <main style={{ width: '100%', backgroundColor: 'white', overflowY: 'auto' }}>
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
              acceptScreenshot={behaviour.acceptScreenshot}
            />
          )}
          {behaviour.selection.type === 'records' && (
            <Records
              selection={behaviour.selection}
              acceptRecords={behaviour.acceptRecords}
            />
          )}
          {behaviour.selection.type === 'error' && (
            <Errors selection={behaviour.selection} />
          )}
        </main>
      </Layout>
    </>
  );
};
