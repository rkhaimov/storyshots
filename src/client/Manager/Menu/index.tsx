import React from 'react';

import { UseBehaviourProps } from '../behaviour/types';
import { MenuHavingStories } from './MenuHavingStories';
import { MenuWaitingStories } from './MenuWaitingStories';

export const Menu: React.FC<UseBehaviourProps> = (props) => {
  if (props.selection.type === 'initializing') {
    return <MenuWaitingStories />;
  }

  return <MenuHavingStories {...props} stories={props.selection.stories} level={0} />;
};
