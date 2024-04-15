import React from 'react';
import styled from 'styled-components';

import { UseBehaviourProps } from '../behaviour/types';
import { MenuHavingStories } from './MenuHavingStories';
import { MenuWaitingStories } from './MenuWaitingStories';
import { TopBar } from './TopBar';

export const Menu: React.FC<UseBehaviourProps> = (props) => {
  if (props.selection.type === 'initializing') {
    return <MenuWaitingStories />;
  }

  return (
    <Sidebar>
      <TopBar
        {...props}
        selection={props.selection}
        stories={props.selection.preview.stories}
      />
      <MenuHavingStories
        {...props}
        stories={props.selection.preview.stories}
        level={0}
      />
    </Sidebar>
  );
};

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
