import React from 'react';
import styled from 'styled-components';

import { UseBehaviourProps } from '../behaviour/types';
import { MenuHavingStories } from './MenuHavingStories';
import { MenuWaitingStories } from './MenuWaitingStories';
import { Presets } from './Presets';

export const Menu: React.FC<UseBehaviourProps> = (props) => {
  if (props.selection.type === 'initializing') {
    return <MenuWaitingStories />;
  }

  return (
    <Sidebar>
      <MenuHavingStories
        {...props}
        stories={props.selection.config.stories}
        level={0}
      />
      <Presets selection={props.selection} setPresets={props.setPresets} />
    </Sidebar>
  );
};

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;
