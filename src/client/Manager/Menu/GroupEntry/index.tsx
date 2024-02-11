import { green } from '@ant-design/colors';
import { PlayCircleOutlined, UpOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import {
  SerializableGroupNode,
  SerializableStoryNode,
  SerializableStoryshotsNode,
} from '../../../reusables/channel';
import { SelectionState } from '../../behaviour/useSelection';
import { TestResults } from '../../behaviour/useTestResults/types';
import { EntryAction } from '../reusables/EntryAction';
import { MenuHavingStories } from '../MenuHavingStories';
import { EntryActions } from '../reusables/EntryActions';
import { EntryHeader } from '../reusables/EntryHeader';
import { EntryStatus, EntryTitle } from '../reusables/EntryTitle';
import { getStoryEntryStatus } from '../reusables/getStoryEntryStatus';
import { Props } from '../types';

export const GroupEntry: React.FC<
  Props & {
    group: SerializableGroupNode;
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
          title={group.title}
          status={getGroupEntryStatus(props.results, props.selection, group.children)}
          style={{ fontSize: 16, fontWeight: 600 }}
        />
        <EntryActions>
          <EntryAction
            icon={
              <PlayCircleOutlined style={{ color: green[6], fontSize: 16 }} />
            }
            action={(e) => {
              e.stopPropagation();

              others.run(extractAllStories(group.children));
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

function extractAllStories(
  nodes: SerializableStoryshotsNode[],
): SerializableStoryNode[] {
  return nodes.flatMap((node) => {
    if (node.type === 'story') {
      return [node];
    }

    return extractAllStories(node.children);
  });
}

function getGroupEntryStatus(
  results: TestResults,
  selection: SelectionState,
  children: SerializableStoryshotsNode[],
): EntryStatus {
  const statuses = children.map((child) =>
    child.type === 'group'
      ? getGroupEntryStatus(results, selection, child.children)
      : getStoryEntryStatus(results, selection, child),
  );

  if (statuses.includes('error')) {
    return 'error';
  }

  if (statuses.includes('fail')) {
    return 'fail';
  }

  if (statuses.includes('fresh')) {
    return 'fresh';
  }

  if (statuses.length > 0 && statuses.every(it => it === 'pass')) {
    return 'pass';
  }

  return null;
}

const Fold = styled(UpOutlined)`
  margin-right: 2px;
  transform: rotate(${({ open }) => `${open ? '180' : '90'}deg`});
  transition: 0.2s;
`;
