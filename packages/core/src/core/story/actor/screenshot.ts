import { assert } from '@lib';
import { Brand } from '../../brand';
import { ActionMeta } from './types';

export type ScreenshotName = Brand<string, 'ScreenshotName'>;

export function assertScreenshotNameConditions(
  meta: ActionMeta[],
): ActionMeta[] {
  const withFinal = addFINALScreenshotIfNeeded(meta);

  assertUnique(withFinal);

  return withFinal;
}

function assertUnique(meta: ActionMeta[]) {
  const shots = meta
    .filter((it) => it.action === 'screenshot')
    .map((it) => it.payload.name);

  assert(
    new Set<ScreenshotName>(shots).size === shots.length,
    'There can not be two or more screenshots with the same label',
  );
}

function addFINALScreenshotIfNeeded(meta: ActionMeta[]): ActionMeta[] {
  const last = meta.at(-1);

  if (last !== undefined && last.action === 'screenshot') {
    return meta;
  }

  return [
    ...meta,
    {
      action: 'screenshot',
      payload: { name: 'FINAL' as ScreenshotName },
    },
  ];
}
