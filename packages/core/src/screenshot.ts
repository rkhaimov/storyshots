import { Brand } from './brand';
import { ActionMeta } from './actor/types';
import { assert } from './utils';

/**
 * Represents a unique identifier for an intermediate screenshot within a story.
 */
export type ScreenshotName = Brand<string, 'ScreenshotName'>;

/**
 * Proof of {@link ScreenshotName} conditions.
 */
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
