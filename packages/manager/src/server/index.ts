import { ManagerConfig, PreviewServe } from './reusables/types';
import { runUI as _runUI } from './modes/runUI';
import { STABILIZER } from './handlers/createActServerSideHandler';
import { runTestsCI as _runCITests } from './modes/runTestsCI';

export type { ManagerConfig, PreviewServe } from './reusables/types';

export { root } from './compiler/manager-root';

export { STABILIZER } from './handlers/createActServerSideHandler';

type OptimizedConfig = Omit<
  Optional<ManagerConfig, 'port' | 'optimization'>,
  'createManagerCompiler'
>;

export const runUI = (config: OptimizedConfig) =>
  _runUI(fromOptimizedConfig(config));

export const runTestsCI = async (config: OptimizedConfig) => {
  const { cleanup } = await _runCITests(fromOptimizedConfig(config));

  cleanup();
  process.exit();
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
});

function fromOptimizedConfig(config: OptimizedConfig): ManagerConfig {
  return {
    port: 6006,
    optimization: {
      agentsCount: 1,
      stabilize: STABILIZER.none,
    },
    ...config,
  };
}

type Optional<TRecord, TKey extends keyof TRecord> = Omit<TRecord, TKey> &
  Partial<Pick<TRecord, TKey>>;
