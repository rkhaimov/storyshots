import { Finder } from './types';
import { SelectorMeta } from '../reusables/actions';
import { assertNotEmpty } from '../reusables/utils';

export const createFinder = (): Finder => {
  let meta: SelectorMeta | undefined = undefined;

  const finder: Finder = {
    getByRole: (role, attrs) => {
      meta = { selector: 'aria', payload: { role, attrs } };

      return finder;
    },
    toMeta: () => {
      // TODO: Make it as a static check
      assertNotEmpty(meta, 'Finder should not be empty');

      return meta;
    },
  };

  return finder;
};
