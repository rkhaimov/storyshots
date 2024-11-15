import { ScreenshotName } from '../screenshot';
import { assert, not } from '../utils';
import { ActionMeta, Actor } from './types';

export const createActor = (meta: ActionMeta[] = []): Actor => {
  const actor: Actor = {
    click: (on, options) =>
      createActor([
        ...meta,
        { action: 'click', payload: { on: on.__toMeta(), options } },
      ]),
    fill: (on, text, options) =>
      createActor([
        ...meta,
        {
          action: 'fill',
          payload: { on: on.__toMeta(), text, options },
        },
      ]),
    hover: (on) =>
      createActor([
        ...meta,
        { action: 'hover', payload: { on: on.__toMeta() } },
      ]),
    select: (on, ...values) =>
      createActor([
        ...meta,
        { action: 'select', payload: { on: on.__toMeta(), values } },
      ]),
    uploadFile: (chooser, ...paths) =>
      createActor([
        ...meta,
        { action: 'uploadFile', payload: { chooser: chooser.toMeta(), paths } },
      ]),
    scrollTo: (to) =>
      createActor([
        ...meta,
        { action: 'scrollTo', payload: { on: to.__toMeta() } },
      ]),
    wait: (ms) => createActor([...meta, { action: 'wait', payload: { ms } }]),
    screenshot: (name) =>
      createActor([
        ...meta,
        {
          action: 'screenshot',
          payload: { name: name as ScreenshotName },
        },
      ]),
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
