import { compose } from './compose';
import { UnknownArrangers } from '../arrangers-types';

export const set: UnknownArrangers['set'] = (path, value) =>
  compose(path, () => value);
