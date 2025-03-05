/**
 * Represents a logging utility for method calls.
 * Provides functionality to record method invocations.
 */
export type Journal = {
  /**
   * Records a method call by storing its name and arguments.
   *
   * @param method - The name of the method being called.
   * @param args - The arguments passed to the method.
   *
   * @example
   * it('...', {
   *   arrange: (externals, config) => ({
   *     createUser: (body) => {
   *       config.journal.record('createUser', body);
   *       return externals.createUser(body);
   *     }
   *   })
   * });
   */
  record(method: string, ...args: unknown[]): void;

  /**
   * Wraps a function to log its calls, including the method name and arguments,
   * while preserving its original return type.
   *
   * @param method - The name of the method to be wrapped.
   * @param fn - The function to be wrapped and logged.
   * @returns A new function that logs its calls and returns the result of the original function.
   *
   * @example
   * it('...', {
   *   arrange: (externals, config) => ({
   *     createUser: config.journal.asRecordable(externals.createUser)
   *   })
   * });
   */
  asRecordable<TArgs extends unknown[], TReturn>(
    method: string,
    fn: (...args: TArgs) => TReturn,
  ): (...args: TArgs) => TReturn;

  /**
   * Retrieves all recorded method calls as an array of JournalRecord objects.
   *
   * @private
   * @returns An array of objects representing the recorded method calls.
   */
  __read(): JournalRecord[];
};

export type JournalRecord = {
  method: string;
  args: unknown[];
};
