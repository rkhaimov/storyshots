import { createRun } from './createRun';
import { describe } from './tree/describe';
import { each } from './tree/each';
import { it } from './tree/it';
import { ExternalsFactory } from './types';

/**
 * Creates a preview application with the provided external dependencies.
 *
 * @template TExternals - The type representing the external dependencies.
 * @param factory - {@link ExternalsFactory}
 * @returns An object with methods to describe tests, define test cases, and run the application with the provided stories.
 *
 * @see {@link it} {@link describe} {@link each}
 *
 * @example
 * ```typescript
 * // Define your external dependencies
 * const factory = {
 *   createExternals: (config) => ({
 *     getUser: async () => ({ id: 1, name: 'John Doe' }),
 *   }),
 *   createJournalExternals: (externals, config) => ({
 *     getUser: config.journal.asRecordable(externals.getUser),
 *   }),
 * };
 *
 * // Create the preview application
 * const { it, run } = createPreviewApp(factory);
 *
 * // Define your stories
 * // Define your stories
 * const stories = [
 *    it('renders the application correctly', {
 *      render: (externals) => <App externals={externals} />
 *    }),
 *    it('handles missing user gracefully', {
 *      arrange: (externals) => ({ ...externals, getUser: async () => null })
 *      render: (externals) => <App externals={externals} />
 *    }),
 * ];
 *
 * // Run the application with the stories
 * run(stories);
 * ```
 */
export function createPreviewApp<TExternals>(
  factory: ExternalsFactory<TExternals>,
) {
  return {
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
    describe: describe,
    /**
     * Creates a story.
     * This function allows you to define the behavior of the story, including how to render, act, arrange external dependencies, and retry logic.
     *
     * @param title - The title of the story.
     * @param config - See {@link StoryConfig}
     * @returns A story object containing the title and configuration settings.
     */
    it: it<TExternals>,
    /**
     * Denotes an aggregate of all generated stories. This can be used inside `describe` to group related stories.
     *
     * @param elements - The array of elements to iterate over.
     * @param onEach - A function that is called on each element. It receives an element and returns a StoryTree item.
     * @returns An aggregate containing the generated children stories.
     *
     * @example
     * export const statusStories = describe('Status Updates', [
     *   it('renders no updates'),
     *   it('renders updates with content'),
     *   each(['Online', 'Offline', 'Busy'], (status) =>
     *     it(`shows user status as ${status}`)
     *   ),
     * ]);
     */
    each: each,
    run: createRun(factory),
  };
}

export { masked } from './masked';
export type { ExternalsFactory };
export type { StoryTree } from './tree/types';
export type { Story } from './tree/it';
export type { StoryAggregate } from './tree/each';
export type { Group } from './tree/describe';
