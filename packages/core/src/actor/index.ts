import { ScreenshotName } from '../screenshot';
import { assert } from '../utils';
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
    hover: (on, options) =>
      createActor([
        ...meta,
        { action: 'hover', payload: { on: on.__toMeta(), options } },
      ]),
    select: (on, values, options) =>
      createActor([
        ...meta,
        { action: 'select', payload: { on: on.__toMeta(), values, options } },
      ]),
    uploadFile: (chooser, ...paths) =>
      createActor([
        ...meta,
        {
          action: 'uploadFile',
          payload: { chooser: chooser.__toMeta(), paths },
        },
      ]),
    scrollTo: (to, options) =>
      createActor([
        ...meta,
        { action: 'scrollTo', payload: { on: to.__toMeta(), options } },
      ]),
    clear: (on, options) =>
      createActor([
        ...meta,
        { action: 'clear', payload: { on: on.__toMeta(), options } },
      ]),
    highlight: (on) =>
      createActor([
        ...meta,
        { action: 'highlight', payload: { on: on.__toMeta() } },
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
    press: (input) =>
      createActor([
        ...meta,
        { action: 'keyboard', payload: { type: 'press', input } },
      ]),
    down: (input) =>
      createActor([
        ...meta,
        { action: 'keyboard', payload: { type: 'down', input } },
      ]),
    up: (input) =>
      createActor([
        ...meta,
        { action: 'keyboard', payload: { type: 'up', input } },
      ]),
    drag: (draggable, to) =>
      createActor([
        ...meta,
        {
          action: 'drag',
          payload: { draggable: draggable.__toMeta(), to: to.__toMeta() },
        },
      ]),
    do: (transform) => transform(actor),
    stop: () => createIdleActor(actor),
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
    !shots.includes('FINAL' as ScreenshotName),
    'FINAL is a reserved word',
  );
}

function createIdleActor(from: Actor): Actor {
  const idle: Actor = {
    click: () => idle,
    press: () => idle,
    down: () => idle,
    up: () => idle,
    fill: () => idle,
    select: () => idle,
    stop: () => idle,
    scrollTo: () => idle,
    screenshot: () => idle,
    do: () => idle,
    hover: () => idle,
    wait: () => idle,
    uploadFile: () => idle,
    clear: () => idle,
    highlight: () => idle,
    drag: () => idle,
    toMeta: () => from.toMeta(),
  };

  return idle;
}
