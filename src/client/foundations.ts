import { StoryID } from '../reusables/types';
import { createActor } from './createActor';
import { Group, Story } from './types';

export function createGroup(
  title: Group['title'],
  children: Group['children'],
): Group {
  return {
    type: 'group',
    title,
    id: title,
    children: extendGroupChildrenIDs(title, children),
  };
}

function extendGroupChildrenIDs(
  parent: string,
  children: Group['children'],
): Group['children'] {
  return children.map((it) => {
    switch (it.type) {
      case 'group':
        return {
          ...it,
          id: `${parent}_${it.id}`,
          children: extendGroupChildrenIDs(parent, it.children),
        };
      case 'story':
        return { ...it, id: `${parent}_${it.id}` as StoryID };
    }
  });
}

type StoryConfig<TExternals> = {
  title: Story<TExternals>['title'];
  render: Story<TExternals>['render'];
  arrange?: Story<TExternals>['arrange'];
  act?: Story<TExternals>['act'];
};

export function createStory<TExternals>(
  config: StoryConfig<TExternals>,
): Story<TExternals> {
  return {
    ...config,
    id: config.title as StoryID,
    type: 'story',
    act: config.act ?? (() => createActor()),
    arrange: config.arrange ?? ((externals) => externals),
  };
}
