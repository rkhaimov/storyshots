import { JournalStoryConfig, StoryConfig } from '@storyshots/core';

/**
 * Factory for creating and manipulating the application's external data sources.
 * @template TExternals - The type representing the external dependencies.
 */
export type ExternalsFactory<TExternals> = {
  /**
   * Main factory to instantiate external dependencies of the application.
   *
   * @param config - {@link StoryConfig} settings for creating externals.
   * @returns The created external dependencies.
   *
   * @example
   * ```typescript
   * createPreview({
   *   createExternals: () => {
   *     // This behavior will be treated as default
   *     getUser: async () => DEFAULT_USER
   *   }
   * });
   * ```
   */
  createExternals(config: StoryConfig): TExternals;

  /**
   * Marks which functions on the externals object must be recordable by default.
   * Once a function is marked as recordable, this action cannot be undone.
   *
   * @param externals - The external dependencies to be marked.
   * @param config - Configuration settings for journal recording.
   * @returns The modified external dependencies with recording enabled.
   *
   * @example
   * ```typescript
   * createPreview({
   *   createJournalExternals: (externals, config) => ({
   *     ...externals,
   *     getUser: config.journal.asRecordable(externals.getUser)
   *   })
   * });
   * ```
   */
  createJournalExternals(
    externals: TExternals,
    config: JournalStoryConfig,
  ): TExternals;
};
