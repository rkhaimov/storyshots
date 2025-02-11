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
    describe: describe,
    it: it<TExternals>,
    each: each,
    run: createRun(factory),
  };
}

export { masked } from './masked';
