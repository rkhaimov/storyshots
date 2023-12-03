import { CameraOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import {
  SerializableGroupNode,
  SerializableStoryNode,
  SerializableStoryshotsNode,
} from '../../../reusables/channel';
import { MenuHavingStories } from '../MenuHavingStories';
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
      <EntryHeader>
        {expanded ? <UpOutlined /> : <DownOutlined />}
        <span onClick={() => others.toggleGroupExpanded(group)}>
          {group.title}
        </span>
        <CameraOutlined
          style={{ fontSize: 20 }}
          onClick={(e) => {
            e.stopPropagation();

            others.run(extractAllStories(group.children));
          }}
        />
      </EntryHeader>
      {expanded && <MenuHavingStories {...others} stories={group.children} />}
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

const EntryHeader = styled.div`
  cursor: pointer;
`;
