import { Group, parseStoryID, Story, StoryID, StoryTree } from './story';

export function map<TExternals>(
  stories: StoryTree<TExternals>,
  transform: (story: Story<TExternals>) => Story<TExternals>,
): StoryTree<TExternals> {
  return mapAll(stories, transform, (group) => group);
}

export function mapAll<TExternals>(
  stories: StoryTree<TExternals>,
  onStory: (story: Story<TExternals>) => Story<TExternals>,
  onGroup: (group: Group<TExternals>) => Group<TExternals>,
): StoryTree<TExternals> {
  if (Array.isArray(stories)) {
    return stories.map((child) => mapAll(child, onStory, onGroup));
  }

  switch (stories.type) {
    case 'group':
      return {
        ...onGroup(stories),
        children: mapAll(stories.children, onStory, onGroup),
      };
    case 'story':
      return onStory(stories);
  }
}

export function flat<TExternals>(
  stories: StoryTree<TExternals>,
): Array<Story<TExternals>> {
  if (Array.isArray(stories)) {
    return stories.flatMap(flat);
  }

  switch (stories.type) {
    case 'group':
      return flat(stories.children);
    case 'story':
      return [stories];
  }
}

export function filter<TExternals>(
  stories: StoryTree<TExternals>,
  predicate: (story: Story<TExternals>) => boolean,
): StoryTree<TExternals> {
  if (Array.isArray(stories)) {
    return stories.reduce<StoryTree<TExternals>[]>((result, child) => {
      const filtered = filter(child, predicate);

      if (isEmpty(filtered)) {
        return result;
      }

      return [...result, filtered];
    }, []);
  }

  switch (stories.type) {
    case 'group': {
      const children = filter(stories.children, predicate);

      if (isEmpty(children)) {
        return EMPTY_TREE;
      }

      return { ...stories, children };
    }
    case 'story':
      return predicate(stories) ? stories : EMPTY_TREE;
  }
}

export function only<TExternals>(
  devices: string[],
  stories: StoryTree<TExternals>,
): StoryTree<TExternals> {
  return map(stories, (story) => ({
    ...story,
    act: (actor, device) =>
      devices.includes(device.name)
        ? story.act(actor, device)
        : { __toMeta: () => [] },
  }));
}

export function find<TExternals>(
  id: StoryID,
  stories: StoryTree<TExternals>,
): Story<TExternals> | undefined {
  if (Array.isArray(stories)) {
    for (const story of stories) {
      const found = find(id, story);

      if (found) {
        return found;
      }
    }

    return undefined;
  }

  const story = stories;

  switch (story.type) {
    case 'story': {
      return story.id === id ? story : undefined;
    }
    case 'group': {
      const parent = parseStoryID(id).includes(story.id);

      return parent ? find(id, story.children) : undefined;
    }
  }
}

function isEmpty(tree: StoryTree) {
  return Array.isArray(tree) && tree.length === 0;
}

const EMPTY_TREE: StoryTree<never> = [];
