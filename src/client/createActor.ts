import { Actor } from './types';
import { ActionMeta } from '../reusables/actions';
import { ScreenshotName } from '../reusables/types';

export const createActor = (): Actor => {
  const meta: ActionMeta[] = [];

  const actor: Actor = {
    click: (finder) => {
      meta.push({ action: 'click', payload: { on: finder.toMeta() } });

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
