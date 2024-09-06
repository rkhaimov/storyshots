import React from 'react';
import styled from 'styled-components';
import { GroupEntry } from './GroupEntry';
import { StoryEntry } from './StoryEntry/StoryEntry';
import { Props } from './types';

export const MenuHavingStories: React.FC<Props> = (props) => (
  <Entries aria-label={`Stories ${props.level}`}>
    {props.stories.map((it) => {
      switch (it.type) {
        case 'node':
          return <GroupEntry key={it.id} {...props} group={it} />;
        case 'leaf':
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
