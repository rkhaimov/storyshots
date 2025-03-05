import { runInBackground as _runInBackground } from './modes/runInBackground';
import { runUI as _runUI } from './modes/runUI';
import { CAPTURE } from './modules/capture';
import { COMPARE } from './modules/compare';
import { RUNNER } from './modules/runner';
import { ManagerConfig as FullManagerConfig, PreviewServe } from './types';

export type { PreviewServe } from './types';

export type ManagerConfig = Omit<
  Optional<FullManagerConfig, 'runner' | 'compare' | 'capture'>,
  'createManagerCompiler'
>;

export const runUI = (config: ManagerConfig) =>
  _runUI(fromOptimizedConfig(config));

export const runInBackground = async (config: ManagerConfig) => {
  const { run, cleanup } = await _runInBackground(fromOptimizedConfig(config));

  await run();
  await cleanup();
};

export const mergeServe = (...handlers: PreviewServe[]): PreviewServe =>
  handlers.reduce(mergeTwoServeHandlers);

const mergeTwoServeHandlers = (
  left: PreviewServe,
  right: PreviewServe,
): PreviewServe => ({
  handler: (req, res, next) =>
    left.handler(req, res, () => right.handler(req, res, next)),
  onUpdate: (handle) => {
    left.onUpdate(handle);
    right.onUpdate(handle);
  },
  cleanup: async () => {
    await left.cleanup();
    await right.cleanup();
  },
});

function fromOptimizedConfig(config: ManagerConfig): FullManagerConfig {
  return {
    compare: COMPARE.withLooksSame(),
    capture: CAPTURE.stabilized({
      attempts: 5,
      interval: (attempt) => 100 * Math.pow(2, attempt),
    }),
    runner: RUNNER.pool({ agentsCount: 1 }),
    ...config,
  };
}

type Optional<TRecord, TKey extends keyof TRecord> = Omit<TRecord, TKey> &
  Partial<Pick<TRecord, TKey>>;

export { CAPTURE } from './modules/capture';
export { COMPARE } from './modules/compare';
export { RUNNER } from './modules/runner';
