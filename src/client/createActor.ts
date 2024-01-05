import { Actor } from './types';
import { ActorMeta } from '../reusables/actions';

export const createActor = (): Actor => {
  const meta: ActorMeta[] = [];

  const actor: Actor = {
    click: (finder) => {
      meta.push({ action: 'click', payload: { on: finder.toMeta() } });

      return actor;
    },
    toMeta: () => meta,
  };

  return actor;
};
