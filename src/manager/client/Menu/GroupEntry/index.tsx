import { green, blue } from '@ant-design/colors';
import { PlayCircleOutlined, UpOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import { PureGroup } from '../../../../reusables/story';
import { MenuHavingStories } from '../MenuHavingStories';
import { EntryAction } from '../reusables/EntryAction';
import { EntryActions } from '../reusables/EntryActions';
import { EntryHeader } from '../reusables/EntryHeader';
import { EntryStatus } from '../reusables/EntryStatus';
import { EntryTitle } from '../reusables/EntryTitle';
import { Props } from '../types';
import { getGroupEntryStatus } from './getGroupEntryStatus';
import { TreeOP } from '../../../../reusables/tree';

export const GroupEntry: React.FC<
  Props & {
    group: PureGroup;
  }
> = (props) => {
  const { group, ...others } = props;
  const expanded = others.expanded.has(group.id);

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
        <EntryActions>
          <EntryAction
            icon={
              <PlayCircleOutlined style={{ color: green[6], fontSize: 16 }} />
            }
            action={(e) => {
              e.stopPropagation();

              others.run(TreeOP.toLeafsArray(group.children));
            }}
          />
          <EntryAction
            icon={
              <PlayCircleOutlined style={{ color: blue[6], fontSize: 16 }} />
            }
            action={(e) => {
              e.stopPropagation();

              others.runComplete(TreeOP.toLeafsArray(group.children));
            }}
          />
        </EntryActions>
      </EntryHeader>
      {expanded && (
        <MenuHavingStories
          {...others}
          stories={group.children}
          level={others.level + 1}
        />
      )}
    </li>
  );
};

const Fold = styled(UpOutlined)`
  margin-right: 2px;
  transform: rotate(${({ open }) => `${open ? '180' : '90'}deg`});
  transition: 0.2s;
`;