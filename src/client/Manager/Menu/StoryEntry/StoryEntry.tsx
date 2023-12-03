import React from 'react';
import styled from 'styled-components';
import { Props } from './types';
import { Actions } from './Actions';
import { Screenshots } from './Screenshots';
import { Records } from './Records';

export const StoryEntry: React.FC<Props> = (props) => {
  return (
    <li>
      <EntryHeader onClick={() => props.setStory(props.story)}>
        {props.story.title}
        <Actions {...props} />
      </EntryHeader>
      <Records {...props} />
      <Screenshots {...props} />
    </li>
  );
};

const EntryHeader = styled.div`
  cursor: pointer;
`;
