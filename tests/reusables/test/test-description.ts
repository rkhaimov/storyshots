import { assertNotEmpty } from '@lib';
import { expect, Page } from '@playwright/test';
import { TempFolder } from './temp-folder';

export const defineManagerStep = (manager: ManagerStep): TestDescription => ({
  __description: () => [
    {
      manager,
      preview: NO_PREVIEW,
      actions: [],
    },
  ],
});

export const withPreviewStep = (
  description: TestDescription,
  preview: ActionStep,
): TestDescription => ({
  __description: () => {
    const parent = description.__description();
    const last = parent.at(-1);

    assertNotEmpty(last);

    if (last.preview === NO_PREVIEW) {
      last.preview = preview;
    } else {
      last.actions.push(preview);
    }

    return parent;
  },
});

export const withActionStep = (
  description: TestDescription,
  action: ActionStep,
): TestDescription => ({
  __description: () => {
    const parent = description.__description();
    const last = parent.at(-1);

    assertNotEmpty(last);

    last.actions.push(action);

    return parent;
  },
});

export const concatDescriptions = (
  ...descriptions: TestDescription[]
): TestDescription => ({
  __description: () => descriptions.flatMap((it) => it.__description()),
});

export const withManagerThrowing = (
  description: TestDescription,
): TestDescription => ({
  __description: () => {
    const parent = description.__description();
    const last = parent.at(-1);

    assertNotEmpty(last);

    const manager = last.manager;

    last.manager = async (page, tf) => {
      const { run, cleanup } = await manager(page, tf);

      return {
        run: () => expect(run()).rejects.toThrow(Error),
        cleanup,
      };
    };

    return parent;
  },
});

export type TestDescription = {
  __description(): Description;
};

type Description = Step[];

type Step = {
  manager: ManagerStep;
  preview: ActionStep;
  actions: ActionStep[];
};

type ManagerStep = (page: Page, tf: TempFolder) => Promise<ManagerMeta>;
export type ActionStep = (page: Page, tf: TempFolder) => Promise<void>;

export type ManagerMeta = {
  cleanup(): Promise<unknown>;
  run(): Promise<unknown>;
};

const NO_PREVIEW = async () => {};
