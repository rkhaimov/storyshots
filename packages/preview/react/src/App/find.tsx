import {
  createGroupID,
  createStoryID,
  GroupID,
  parseStoryID,
  StoryID,
} from '@storyshots/core';
import { Story } from '../tree/it';
import { StoryTree } from '../tree/types';

export function find(
  id: StoryID,
  stories: StoryTree[],
  parent?: GroupID,
): Story | undefined {
  for (const node of stories) {
    switch (node.type) {
      case 'story': {
        if (createStoryID(node.title, parent) === id) {
          return node;
        }

        break;
      }
      case 'aggregate': {
        const found = find(id, node.children, parent);

        if (found) {
          return found;
        }

        break;
      }
      case 'group': {
        const groupID = createGroupID(node.title, parent);

        if (parseStoryID(id).includes(groupID)) {
          return find(id, node.children, groupID);
        }

        break;
      }
    }
  }
}
