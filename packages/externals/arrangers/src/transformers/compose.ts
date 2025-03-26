import { UnknownArrangers } from '../arrangers-types';

export const compose: UnknownArrangers['compose'] = (path, transform) => {
  return (externals, config) =>
    clone(externals, path.split('.'), (value) => transform(value, config));
};

const clone = (
  externals: unknown,
  segments: string[],
  update: (value: unknown) => unknown,
): unknown => {
  if (segments.length === 0) {
    return update(externals);
  }

  const [key, ...nested] = segments;
  const collection = (externals ?? {}) as Record<string, unknown>;

  return {
    ...collection,
    [key]: clone(collection[key], nested, update),
  };
};
