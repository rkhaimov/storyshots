import { UpOutlined } from '@ant-design/icons';
import { PureGroup, TreeOP } from '@storyshots/core';
import React from 'react';
import styled from 'styled-components';
import { MenuHavingStories } from '../MenuHavingStories';
import { EntryActions } from '../reusables/EntryActions';
import { EntryHeader } from '../reusables/EntryHeader';
import { EntryStatus } from '../reusables/EntryStatus';
import { EntryTitle } from '../reusables/EntryTitle';
import { RunAction } from '../reusables/RunAction';
import { RunCompleteAction } from '../reusables/RunCompleteAction';
import { Props } from '../types';
import { getGroupEntryStatus } from './getGroupEntryStatus';

export const GroupEntry: React.FC<
  Props & {
    group: PureGroup;
  }
> = (props) => {
  const { group, selection, ...others } = props;
  const expanded = others.expanded.has(group.id);

  if (selection.type === 'initializing') {
    return;
  }

  return (
    <li>
      <EntryHeader
        $offset={8}
        $level={others.level}
        onClick={() => others.toggleGroupExpanded(group)}
        role="menuitem"
        aria-label={group.payload.title}
      >
        <Fold open={expanded} />
        <EntryTitle
          left={
            <EntryStatus
              status={getGroupEntryStatus(
                props.results,
                props.selection,
                group.children,
              )}
            />
          }
          title={group.payload.title}
          style={{ fontSize: 16, fontWeight: 600 }}
        />
        <EntryActions waiting={isPlayingOrRunning()}>
          <RunAction
            stories={TreeOP.toLeafsArray(group.children)}
            selection={selection}
            run={others.run}
          />
          <RunCompleteAction
            stories={TreeOP.toLeafsArray(group.children)}
            selection={selection}
            runComplete={others.runComplete}
          />
        </EntryActions>
      </EntryHeader>
      {expanded && (
        <MenuHavingStories
          {...others}
          stories={group.children}
          selection={selection}
          level={others.level + 1}
        />
      )}
    </li>
  );

  function isPlayingOrRunning() {
    const { results, selection, group } = props;

    const ids = TreeOP.toLeafsArray(group.children).map((it) => it.id);

    const playing =
      selection.type === 'story' &&
      ids.includes(selection.story.id) &&
      selection.playing;

    return playing || ids.some((it) => results.get(it)?.running ?? false);
  }
};

const Fold = styled(UpOutlined)`
  margin-right: 2px;
  transform: rotate(${({ open }) => `${open ? '180' : '90'}deg`});
`;
