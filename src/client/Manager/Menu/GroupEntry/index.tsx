import { green } from '@ant-design/colors';
import { PlayCircleOutlined, UpOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import {
  SerializableGroupNode,
  SerializableStoryNode,
  SerializableStoryshotsNode,
} from '../../../reusables/channel';
import { MenuHavingStories } from '../MenuHavingStories';
import { ActionButton } from '../ActionButton';
import { Props } from '../types';
import { Status, getGroupStatus } from '../../../reusables/Status';

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
        level={others.level}
        onClick={() => others.toggleGroupExpanded(group)}
      >
        <Fold open={expanded} />
        <Status type={getGroupStatus(group.children, others.results)} />
        <EntryTitle title={group.title}>{group.title}</EntryTitle>
        <div>
          <ActionButton
            icon={
              <PlayCircleOutlined style={{ color: green[6], fontSize: 20 }} />
            }
            action={(e) => {
              e.stopPropagation();

              others.run(extractAllStories(group.children));
            }}
          />
        </div>
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

const Fold = styled(UpOutlined)`
  margin-right: 2px;
  transform: rotate(${({ open }) => `${open ? '180' : '90'}deg`});
  transition: 0.2s;
`;

const EntryHeader = styled.div.attrs<{ level: number }>((props) => ({
  level: props.level,
}))`
  display: flex;
  align-items: center;
  padding: 2px;
  padding-left: ${(props) => `${props.level * 24 + 8}px`};
  transition: 0.2s ease-in-out;
  cursor: pointer;

  &:hover,
  &:focus {
    background: #fafafa;
  }
`;

const EntryTitle = styled.span`
  flex: 1 1 auto;
  font-size: 16px;
  font-weight: 600;
  min-width: 100px;
  margin-top: -2px;
  padding: 0 4px;
  user-select: none;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
