import React from 'react';
import styled from 'styled-components';
import { GroupEntry } from './GroupEntry';
import { StoryEntry } from './StoryEntry/StoryEntry';
import { Props } from './types';

export const MenuHavingStories: React.FC<Props> = (props) => (
  <Entries>
    {props.stories.map((it): React.ReactNode => {
      switch (it.type) {
        case 'group':
          return <GroupEntry key={it.id} {...props} group={it} />;
        case 'story':
          return <StoryEntry key={it.id} {...props} story={it} />;
      }
    })}
  </Entries>
);

const Entries = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  overflow-y: auto;
  overflow-x: hidden;
`;
