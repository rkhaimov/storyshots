import { expect } from '@playwright/test';
import { wait } from '@storyshots/core';
import { createActorTestsFactory } from './factories';
import { createPreview, Preview } from './preview';
import { Action, Arrangers } from './test';

export type Actor<TExternals> = {
  screenshot(): Actor<TExternals>;
  open(title: string, under?: string): Actor<TExternals>;
  run(title: string): Actor<TExternals>;
  accept(title: string): Actor<TExternals>;
  do(action: Action): Actor<TExternals>;
  preview(): Preview<TExternals>;
  __arrangers(): Arrangers;
};

export function createActor<TExternals>(factory: Arrangers) {
  const actions: Action[] = [];

  const actor: Actor<TExternals> = {
    open: (title, under) =>
      actor
        .do((page) =>
          under
            ? page.getByLabel(under).getByText(title).click()
            : page.getByText(title).click(),
        )
        .do((page) =>
          Promise.race([page.waitForLoadState('networkidle'), wait(1_000)]),
        ),
    accept: (title) =>
      actor
        .do((page) => page.getByText(title).hover())
        .do((page) => page.getByLabel('Accept all').click()),
    run: (title) =>
      actor
        .do((page) => page.getByText(title).hover())
        .do((page) =>
          page.getByLabel(title).getByLabel('Run', { exact: true }).click(),
        )
        .do((page) =>
          page
            .getByLabel('Status')
            .getByRole('button', { name: 'Run complete' })
            .waitFor({ state: 'visible' }),
        ),
    screenshot: () => actor.do((page) => expect(page).toHaveScreenshot()),
    do: (action) => {
      actions.push(action);

      return actor;
    },
    preview: () => createPreview(actor.__arrangers()) as never,
    __arrangers: () => createActorTestsFactory(factory, actions),
  };

  return actor;
}
