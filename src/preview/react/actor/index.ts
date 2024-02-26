import { ScreenshotName } from '../../../reusables/screenshot';
import { Actor } from './types';
import { ActionMeta } from '../../../reusables/actions';

export const createActor = (): Actor => {
  const meta: ActionMeta[] = [];

  const actor: Actor = {
    click: (on) => {
      meta.push({ action: 'click', payload: { on: on.toMeta() } });

      return actor;
    },
    fill: (on, text) => {
      meta.push({ action: 'fill', payload: { on: on.toMeta(), text } });

      return actor;
    },
    hover: (on) => {
      meta.push({ action: 'hover', payload: { on: on.toMeta() } });

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
    toMeta: () => meta,
  };

  return actor;
};
