import { UnknownArrangers } from '../arrangers-types';

export const iterated: UnknownArrangers['iterated'] = (values, transform) => {
  let iter = 0;
  const next = () => {
    const result = values[iter % values.length];

    iter += 1;

    return result;
  };

  return transform(next);
};
