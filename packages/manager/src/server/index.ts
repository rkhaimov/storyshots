import { ManagerConfig, PreviewServe } from './reusables/types';
import { runUI as _runUI } from './modes/runUI';
import { STABILIZER } from './handlers/createActServerSideHandler';
import { runTestsCI as _runCITests } from './modes/runTestsCI';

export type { ManagerConfig, PreviewServe } from './reusables/types';

export { root } from './compiler/manager-root';

export { STABILIZER } from './handlers/createActServerSideHandler';

type PublicConfig = Omit<
  Optional<ManagerConfig, 'optimization'>,
  'createManagerCompiler'
>;

export const runUI = (config: PublicConfig) =>
  _runUI(fromOptimizedConfig(config));

export const runTestsCI = async (config: PublicConfig) => {
  const { run } = await _runCITests(fromOptimizedConfig(config));

  await run();

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

function fromOptimizedConfig(config: PublicConfig): ManagerConfig {
  return {
    optimization: {
      agentsCount: 1,
      retries: 0,
      stabilize: STABILIZER.none,
    },
    ...config,
  };
}

type Optional<TRecord, TKey extends keyof TRecord> = Omit<TRecord, TKey> &
  Partial<Pick<TRecord, TKey>>;
