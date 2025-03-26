import { compose } from './compose';
import { record } from './record';
import { set } from './set';
import { arrange } from './arrange';
import { iterated } from './iterated';
import { UnknownArrangers } from '../arrangers-types';

export const focus: UnknownArrangers['focus'] = (parent) => {
  return {
    arrange,
    iterated,
    set: (path, value) => set(join(parent, path), value),
    record: (...paths) => record(...paths.map((path) => join(parent, path))),
    compose: (path, transform) => compose(join(parent, path), transform),
    focus: (sub) => focus(join(parent, sub)),
  };
};

export const EMPTY_PATH = {} as never;

const join = (parent: string, sub: string) =>
  parent === EMPTY_PATH ? sub : `${parent}.${sub}`;
