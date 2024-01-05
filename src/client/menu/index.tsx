import React from 'react';
import { Group, Node, Story } from '../types';
import { MenuProps, Menu as AntdMenu } from 'antd';
import { assertNotEmpty } from '../../reusables/utils';
import { useStoryBehaviour } from '../useStoryBehaviour';

type Props = Pick<
  ReturnType<typeof useStoryBehaviour>,
  'story' | 'setStory'
> & {
  stories: Node[];
};

export const Menu: React.ComponentType<Props> = ({
  setStory,
  story,
  stories,
}) => (
  <AntdMenu
    mode="inline"
    theme="light"
    style={{ height: '100%' }}
    {...createSelectedKeysFromStory(stories, story)}
    items={createMenuItemsFromStories(stories, setStory)}
  />
);

type MenuItem = {
  key: string;
  label: string;
  children?: MenuItem[];
  onClick?(): void;
};

function createSelectedKeysFromStory(
  stories: Node[],
  story?: Story,
): Pick<MenuProps, 'defaultOpenKeys' | 'selectedKeys'> {
  if (story === undefined) {
    return {
      defaultOpenKeys: [],
      selectedKeys: [],
    };
  }

  const parents = constructParentsChain(stories, story);

  assertNotEmpty(parents, 'Was not able to construct story path from stories');

  const active = [...parents.map(({ title }) => title), story.title].join('_');

  return {
    defaultOpenKeys: parents.reduce<string[]>((prev, it) => {
      if (prev.length === 0) {
        return [it.title];
      }

      return [...prev, `${prev[prev.length - 1]}_${it.title}`];
    }, []),
    selectedKeys: [active],
  };
}

function constructParentsChain(
  stories: Node[],
  story: Story,
): Group[] | undefined {
  if (stories.length === 0) {
    return undefined;
  }

  const [head, ...tail] = stories;

  if (head.type === 'story') {
    return head.title === story.title ? [] : constructParentsChain(tail, story);
  }

  const path = constructParentsChain(head.children, story);

  if (path === undefined) {
    return constructParentsChain(tail, story);
  }

  return [head, ...path];
}

function createMenuItemsFromStories(
  stories: Node[],
  onClick: (story: Story) => void,
  parent?: string,
): MenuItem[] {
  return stories.map((it): MenuItem => {
    const key = parent === undefined ? it.title : `${parent}_${it.title}`;

    switch (it.type) {
      case 'group':
        return {
          key,
          label: it.title,
          children: createMenuItemsFromStories(it.children, onClick, key),
        };
      case 'story':
        return {
          key,
          label: it.title,
          onClick: () => onClick(it),
        };
    }
  });
}
