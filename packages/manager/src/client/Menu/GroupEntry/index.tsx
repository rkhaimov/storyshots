import { green, blue } from '@ant-design/colors';
import { PlayCircleOutlined, UpOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import { MenuHavingStories } from '../MenuHavingStories';
import { EntryAction } from '../reusables/EntryAction';
import { EntryActions } from '../reusables/EntryActions';
import { EntryHeader } from '../reusables/EntryHeader';
import { EntryStatus } from '../reusables/EntryStatus';
import { EntryTitle } from '../reusables/EntryTitle';
import { Props } from '../types';
import { getGroupEntryStatus } from './getGroupEntryStatus';
import { LeafNodeID, PureGroup, TreeOP } from '@storyshots/core';

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
          <EntryAction
            icon={
              <PlayCircleOutlined style={{ color: green[6], fontSize: 16 }} />
            }
            action={(e) => {
              e.stopPropagation();

              others.run(
                TreeOP.toLeafsArray(group.children),
                selection.config.devices,
                selection.presets,
              );
            }}
          />
          <EntryAction
            icon={
              <PlayCircleOutlined style={{ color: blue[6], fontSize: 16 }} />
            }
            action={(e) => {
              e.stopPropagation();

              others.runComplete(
                TreeOP.toLeafsArray(group.children),
                selection.config.devices,
                selection.config.presets,
              );
            }}
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

    const ids = collectLeafNodeIds(group.children);

    const playing =
      selection.type === 'story' &&
      ids.includes(selection.story.id) &&
      selection.playing;

    return playing || ids.some((it) => results.get(it)?.running ?? false);

    function collectLeafNodeIds(
      groupChildren: PureGroup['children'],
    ): LeafNodeID[] {
      return groupChildren.flatMap((it) => {
        if (it.type === 'leaf') {
          return it.id;
        } else {
          return collectLeafNodeIds(it.children);
        }
      });
    }
  }
};

const Fold = styled(UpOutlined)`
  margin-right: 2px;
  transform: rotate(${({ open }) => `${open ? '180' : '90'}deg`});
  transition: 0.2s;
`;
