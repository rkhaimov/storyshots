import { Page } from '@playwright/test';
import { clean, CreateTempPath } from './env';

export const createEmptyDescription = (): TestDescription => ({
  __description: () => ({
    actions: [],
    onRun: async () => ({
      cleanup: async () => {},
      run: async () => {},
    }),
  }),
});

export const onRun = (
  description: TestDescription,
  handle: OnRun,
): TestDescription => ({
  __description: () => ({ ...description.__description(), onRun: handle }),
});

export const onSetup = (
  description: TestDescription,
  handle: OnSetup,
): TestDescription => ({
  __description: () => ({ ...description.__description(), onSetup: handle }),
});

export const onJoinAct = (
  description: TestDescription,
  handle: (createTP: CreateTempPath, page: Page) => Promise<unknown>,
): TestDescription => ({
  __description: () => ({
    ...description.__description(),
    actions: [
      ...description.__description().actions,
      async (createTP, page) => ({
        cleanup: async () => {},
        run: () => handle(createTP, page),
      }),
    ],
  }),
});

export const hasSetup = (description: TestDescription): boolean =>
  typeof description.__description().onSetup === 'function';

export const concat = (...descriptions: TestDescription[]) =>
  descriptions.reduce(join);

const join = (
  left: TestDescription,
  right: TestDescription,
): TestDescription => ({
  __description: () => {
    return {
      ...left.__description(),
      actions: [
        ...left.__description().actions,
        createActionFromSetup(right),
        ...right.__description().actions,
      ],
    };
  },
});

const createActionFromSetup =
  (description: TestDescription): OnAct =>
  async (createTP, page) => {
    await clean();

    await description.__description().onSetup?.(createTP, page);

    return description.__description().onRun?.(createTP, page);
  };

export type TestDescription = {
  __description(): {
    onSetup?: OnSetup;
    onRun: OnRun;
    actions: OnAct[];
  };
};

export type Cleanup = () => Promise<unknown>;

type RunMeta = {
  cleanup: Cleanup;
  run(): Promise<unknown>;
};

type OnRun = (createTP: CreateTempPath, page: Page) => Promise<RunMeta>;
type OnAct = (createTP: CreateTempPath, page: Page) => Promise<RunMeta>;
type OnSetup = (createTP: CreateTempPath, page: Page) => Promise<unknown>;
