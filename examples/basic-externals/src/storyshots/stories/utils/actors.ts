import { ActorTransformer, finder } from '@storyshots/core';

export function open(menuTitle: string): ActorTransformer {
  return (actor) =>
    actor.click(
      finder
        .locator('.ant-list-item')
        .filter({ hasText: menuTitle })
        .getByLabel('Navigate'),
    );
}
