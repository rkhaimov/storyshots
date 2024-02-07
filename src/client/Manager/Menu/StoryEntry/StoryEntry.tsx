import React from 'react';
import { blue } from '@ant-design/colors';
import { isNil } from '../../../../reusables/utils';
import { Status, getStoryStatus } from '../../../reusables/Status';
import { Actions } from './Actions';
import { ErrorsEntry } from './ErrorsEntry';
import { RecordsEntry } from './RecordsEntry';
import { ScreenshotsEntry } from './ScreenshotsEntry';
import { Props } from './types';
import { Title } from './styled/Title';
import { Header } from './styled/Header';

export const StoryEntry: React.FC<Props> = (props) => {
  return (
    <li>
      <Header
        levelMargin={8}
        level={props.level}
        active={isActive()}
        activeColor={blue[0]}
        onClick={() => props.setStory(props.story)}
      >
        <Title title={props.story.title}>
          <Status type={getStoryStatus(props.story.id, props.results)} />
          <span>{props.story.title}</span>
        </Title>
        <Actions {...props} />
      </Header>
      {renderResultEntries()}
    </li>
  );

  function renderResultEntries() {
    const results = props.results.get(props.story.id);

    if (isNil(results) || results.running) {
      return;
    }

    if (results.type === 'error') {
      return <ErrorsEntry {...props} results={results} />;
    }

    return (
      <>
        <RecordsEntry {...props} results={results} />
        <ScreenshotsEntry {...props} results={results} />
      </>
    );
  }

  function isActive() {
    return (
      props.selection.type === 'story' &&
      props.selection.story.id === props.story.id
    );
  }
};
