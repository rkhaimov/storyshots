import { green } from '@ant-design/colors';
import { PlayCircleOutlined, UpOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import {
  SerializableGroupNode,
  SerializableStoryNode,
  SerializableStoryshotsNode,
} from '../../../reusables/channel';
import { MenuHavingStories } from '../MenuHavingStories';
import { ActionButton } from '../ActionButton';
import { Props } from '../types';
import {
  Status,
  getCommonStatus,
  getStoryStatus,
} from '../../../reusables/Status';
import { TestResults } from '../../behaviour/useTestResults/types';
import { StatusType } from '../../../reusables/Status/types';
import { Header } from '../../../reusables/Menu/styled/Header';
import { Title } from '../../../reusables/Menu/styled/Title';

export const GroupEntry: React.FC<
  Props & {
    group: SerializableGroupNode;
  }
> = (props) => {
  const { group, ...others } = props;
  const expanded = others.expanded.has(group.id);
  const [actionsOpacity, setActionsOpacity] = useState(0);

  return (
    <li>
      <Header
        levelMargin={8}
        level={others.level}
        active={false}
        activeColor=""
        onClick={() => others.toggleGroupExpanded(group)}
        onMouseEnter={() => setActionsOpacity(1)}
        onMouseLeave={() => setActionsOpacity(0)}
      >
        <Fold open={expanded} />
        <Title title={group.title} fontSize={16} fontWeight={600}>
          <Status type={getGroupStatus(group.children, others.results)} />
          {group.title}
        </Title>
        <GroupActions opacity={actionsOpacity}>
          <ActionButton
            icon={
              <PlayCircleOutlined style={{ color: green[6], fontSize: 20 }} />
            }
            action={(e) => {
              e.stopPropagation();

              others.run(extractAllStories(group.children));
            }}
          />
        </GroupActions>
      </Header>
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

export function getGroupStatus(
  nodes: SerializableStoryshotsNode[],
  results: TestResults,
): StatusType {
  const allStoriesStatuses = nodes.map((it) => {
    if (it.type === 'group') {
      return getGroupStatus(it.children, results);
    }

    return getStoryStatus(it.id, results);
  });

  return getCommonStatus(allStoriesStatuses);
}

const Fold = styled(UpOutlined)`
  margin-right: 2px;
  transform: rotate(${({ open }) => `${open ? '180' : '90'}deg`});
  transition: 0.2s;
`;

const GroupActions = styled.div.attrs<{ opacity: number }>((props) => ({
  opacity: props.opacity,
}))`
  transition: opacity 0.2s ease-in-out;
  opacity: ${(props) => props.opacity};
`;
