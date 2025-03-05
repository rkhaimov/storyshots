import { StoryTree } from './types';

/**
 * Describes a semantic group tests.
 *
 * @param title - The title of the group. Should not contain characters that are invalid in file names (e.g., `/`, `:`, `*`, `?`, `|`).
 * @param children - The children test entities.
 * @returns A group of stories
 *
 * @example
 * export const loginStories = describe('Login', [
 *   it('renders login form'),
 *   it('displays error on invalid credentials'),
 *   describe('Authentication Flow', [
 *     it('successfully logs in with valid credentials'),
 *     it('displays loading spinner during authentication'),
 *   ]),
 * ]);
 */
export function describe(title: string, children: Group['children']): Group {
  return { type: 'group', title, children };
}

export type Group = {
  type: 'group';
  title: string;
  children: StoryTree[];
};
