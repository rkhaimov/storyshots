import { assertScreenshotNameConditions, ScreenshotName } from '../screenshot';
import { ActionMeta, Actor } from './types';

export const createActor = (meta: ActionMeta[] = []): Actor => {
  const actor: Actor = {
    click: (on, options) =>
      withAction({
        action: 'click',
        payload: { on: on.__toMeta(), options },
      }),
    fill: (on, text, options) =>
      withAction({
        action: 'fill',
        payload: { on: on.__toMeta(), text, options },
      }),
    hover: (on, options) =>
      withAction({
        action: 'hover',
        payload: { on: on.__toMeta(), options },
      }),
    select: (on, values, options) =>
      withAction({
        action: 'select',
        payload: { on: on.__toMeta(), values, options },
      }),
    uploadFile: (chooser, ...paths) =>
      withAction({
        action: 'uploadFile',
        payload: { chooser: chooser.__toMeta(), paths },
      }),
    scrollTo: (to, options) =>
      withAction({
        action: 'scrollTo',
        payload: { on: to.__toMeta(), options },
      }),
    clear: (on, options) =>
      withAction({
        action: 'clear',
        payload: { on: on.__toMeta(), options },
      }),
    highlight: (on) =>
      withAction({ action: 'highlight', payload: { on: on.__toMeta() } }),
    wait: (ms) => withAction({ action: 'wait', payload: { ms } }),
    screenshot: (name, options) =>
      withAction({
        action: 'screenshot',
        payload: {
          name: name as ScreenshotName,
          options: {
            mask: options?.mask?.map((selector) => selector.__toMeta()),
            maskColor: options?.maskColor,
          },
        },
      }),
    press: (input) =>
      withAction({ action: 'keyboard', payload: { type: 'press', input } }),
    down: (input) =>
      withAction({ action: 'keyboard', payload: { type: 'down', input } }),
    up: (input) =>
      withAction({ action: 'keyboard', payload: { type: 'up', input } }),
    drag: (draggable, to) =>
      withAction({
        action: 'drag',
        payload: { draggable: draggable.__toMeta(), to: to.__toMeta() },
      }),
    blur: (on, options) =>
      withAction({
        action: 'blur',
        payload: { on: on.__toMeta(), options },
      }),
    pressSequentially: (on, text, options) =>
      withAction({
        action: 'pressSequentially',
        payload: { on: on.__toMeta(), text, options },
      }),
    do: (transform) => transform(actor),
    stop: () => createIdleActor(actor),
    __toMeta: () => assertScreenshotNameConditions(meta),
  };

  function withAction(action: ActionMeta) {
    return createActor([...meta, action]);
  }

  return actor;
};

function createIdleActor(from: Actor): Actor {
  const idle = new Proxy(from, {
    get: (_, prop) => (prop === '__toMeta' ? from.__toMeta : () => idle),
  });

  return idle;
}
