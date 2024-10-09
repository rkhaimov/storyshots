import { ScreenshotName } from '../screenshot';
import { assert, not } from '../utils';
import { ActionMeta, Actor } from './types';

export const createActor = (): Actor => {
  const meta: ActionMeta[] = [];

  const actor: Actor = {
    click: (on, options) => {
      meta.push({ action: 'click', payload: { on: on.__toMeta(), options } });

      return actor;
    },
    fill: (on, text, options) => {
      meta.push({
        action: 'fill',
        payload: { on: on.__toMeta(), text, options },
      });

      return actor;
    },
    hover: (on) => {
      meta.push({ action: 'hover', payload: { on: on.__toMeta() } });

      return actor;
    },
    scrollTo: (to) => {
      meta.push({ action: 'scroll-to', payload: { on: to.__toMeta() } });

      return actor;
    },
    scroll: (amount, on) => {
      meta.push({
        action: 'scroll',
        payload: { on: on?.__toMeta(), x: 0, y: amount },
      });

      return actor;
    },
    wait: (ms) => {
      meta.push({ action: 'wait', payload: { ms } });

      return actor;
    },
    screenshot: (name) => {
      meta.push({
        action: 'screenshot',
        payload: { name: name as ScreenshotName },
      });

      return actor;
    },
    do: (transform) => transform(actor),
    toMeta: () => {
      assertAllScreenshotsAreUniq(meta);

      const last: ActionMeta | undefined = meta[meta.length - 1];

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
    },
  };

  return actor;
};

function assertAllScreenshotsAreUniq(meta: ActionMeta[]) {
  const shots = meta
    .filter(
      (it): it is Extract<ActionMeta, { action: 'screenshot' }> =>
        it.action === 'screenshot',
    )
    .map((it) => it.payload.name);

  assert(
    new Set<ScreenshotName>(shots).size === shots.length,
    'There can not be two or more screenshots with the same label',
  );

  assert(
    not(shots.includes('FINAL' as ScreenshotName)),
    'FINAL is a reserved word',
  );
}
