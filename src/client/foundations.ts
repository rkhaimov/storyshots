import { Group, Story } from './types';

export function createGroup(
  title: Group['title'],
  children: Group['children'],
): Group {
  return {
    type: 'group',
    title,
    children,
  };
}

export function createStory(config: Omit<Story, 'type'>): Story {
  return { ...config, type: 'story' };
}
