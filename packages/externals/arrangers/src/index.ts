import { Arrangers } from './arrangers-types';
import { EMPTY_PATH, focus } from './transformers/focus';

export function createArrangers<TExternals>() {
  return focus(EMPTY_PATH) as Arrangers<TExternals, TExternals>;
}

export type {
  Arrangers,
  Arranger,
  UnknownArrangers,
  UnknownArranger,
} from './arrangers-types';
