import React from 'react';
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
        <Sider style={{ background: colorBgContainer }}>
          <Menu {...behaviour} />
        </Sider>
        <main style={{ width: '100%', backgroundColor: 'white' }}>
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
