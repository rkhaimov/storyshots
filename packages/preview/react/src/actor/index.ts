import { ActionMeta, ScreenshotName } from '@storyshots/core';
import { Actor } from './types';

export const createActor = (): Actor => {
  const meta: ActionMeta[] = [];

  const actor: Actor = {
    click: (on, options) => {
      meta.push({ action: 'click', payload: { on: on.toMeta(), options } });

      return actor;
    },
    fill: (on, text, options) => {
      meta.push({
        action: 'fill',
        payload: { on: on.toMeta(), text, options },
      });

      return actor;
    },
    hover: (on) => {
      meta.push({ action: 'hover', payload: { on: on.toMeta() } });

      return actor;
    },
    scrollTo: (to) => {
      meta.push({ action: 'scroll-to', payload: { on: to.toMeta() } });

      return actor;
    },
    scroll: (amount, on) => {
      meta.push({
        action: 'scroll',
        payload: { on: on?.toMeta(), x: 0, y: amount },
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
    toMeta: () => meta,
  };

  return actor;
};
