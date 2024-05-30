import { Layout, theme } from 'antd';
import React from 'react';
import { useBehaviour } from './behaviour';
import { Menu } from './Menu';
import { StatusPane } from './StatusPane';
import { Records } from './Records';
import { Screenshot } from './Screenshot';
import { EmulatedPreviewFrame } from './EmulatedPreviewFrame';
import { Props } from './types';

const { Sider } = Layout;

export const Manager: React.FC<Props> = (props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const behaviour = useBehaviour(props);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Layout hasSider style={{ flex: 1 }}>
        <Sider
          width={250}
          style={{
            background: colorBgContainer,
            overflowY: 'auto',
            overflowX: 'hidden',
            borderRight: '1px solid #cecece',
          }}
        >
          <Menu {...behaviour} />
        </Sider>
        <main
          style={{
            width: '100%',
            backgroundColor: 'white',
          }}
        >
          <EmulatedPreviewFrame
            selection={behaviour.selection}
            key={behaviour.identity}
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
      <StatusPane {...behaviour} />
    </div>
  );
};
