import {
  createActor,
  GroupID,
  ManagerState,
  PureStoryTree,
  createStoryID,
  createGroupID,
} from '@storyshots/core';
import { Group } from '../../tree/describe';
import { Story } from '../../tree/it';
import { StoryTree } from '../../tree/types';

export function toPureStories(
  manager: ManagerState,
  nodes: StoryTree[],
  parent?: GroupID,
): PureStoryTree[] {
  return nodes.flatMap((node): PureStoryTree[] => {
    switch (node.type) {
      case 'aggregate':
        return toPureStories(manager, node.children, parent); // propagate parent to children
      case 'group':
        return createGroupFactory(manager, node, parent);
      case 'story':
        return createStoryFactory(manager, node, parent);
    }
  });
}

function createGroupFactory(
  manager: ManagerState,
  node: Group,
  parent?: GroupID,
): PureStoryTree[] {
  const groupID = createGroupID(node.title, parent);

  return [
    {
      type: 'group',
      id: groupID,
      title: node.title,
      children: toPureStories(manager, node.children, groupID), // passing groupID as parent
    },
  ];
}

function createStoryFactory(
  manager: ManagerState,
  node: Story,
  parent?: GroupID,
): PureStoryTree[] {
  return [
    {
      type: 'story',
      id: createStoryID(node.title, parent), // create StoryID with parent context
      title: node.title,
      cases: manager.devices.map((device) => ({
        device,
        retries: node.payload.retries(device),
        actions: node.payload.act(createActor(), device).__toMeta(),
      })),
    },
  ];
}
