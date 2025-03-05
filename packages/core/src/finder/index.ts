import { Finder, FinderMeta } from './types';
import { isNil } from '../utils';

export const finder = createFinder();

function createFinder(result: FinderMeta['consequent'] = []) {
  const finder: Finder = {
    getByRole: (role, options) =>
      createFinder([
        ...result,
        {
          type: 'locator',
          by: { type: 'role', role, options },
        },
      ]),
    getByText: (text, options) =>
      createFinder([
        ...result,
        {
          type: 'locator',
          by: { type: 'text', text, options },
        },
      ]),
    getByPlaceholder: (text, options) =>
      createFinder([
        ...result,
        {
          type: 'locator',
          by: { type: 'placeholder', text, options },
        },
      ]),
    getByTitle: (text, options) =>
      createFinder([
        ...result,
        {
          type: 'locator',
          by: { type: 'title', text, options },
        },
      ]),
    getByLabel: (text, options) =>
      createFinder([
        ...result,
        {
          type: 'locator',
          by: { type: 'label', text, options },
        },
      ]),
    getByAltText: (text, options) =>
      createFinder([
        ...result,
        {
          type: 'locator',
          by: { type: 'alt-text', text, options },
        },
      ]),
    locator: (selector) =>
      createFinder([
        ...result,
        { type: 'locator', by: { type: 'selector', selector } },
      ]),
    get: (transformer) => transformer(finder),
    filter: (options) =>
      createFinder([
        ...result,
        {
          type: 'filter',
          options: {
            ...options,
            has: isNil(options.has) ? undefined : options.has.__toMeta(),
            hasNot: isNil(options.hasNot)
              ? undefined
              : options.hasNot.__toMeta(),
          },
        },
      ]),
    and: (selector) =>
      createFinder([
        ...result,
        {
          type: 'and',
          condition: selector.__toMeta(),
        },
      ]),
    nth: (index) =>
      createFinder([
        ...result,
        { type: 'index', options: { kind: 'nth', at: index } },
      ]),
    first: () =>
      createFinder([...result, { type: 'index', options: { kind: 'first' } }]),
    last: () =>
      createFinder([...result, { type: 'index', options: { kind: 'last' } }]),
    __toMeta: () => {
      if (result.length === 0) {
        throw new Error('Finder selector cannot be empty');
      }

      const [beginning, ...consequent] = result;

      if (beginning.type !== 'locator') {
        throw new Error(
          `Finder selector must start with valid entry, ${beginning.type} was found instead`,
        );
      }

      return {
        beginning,
        consequent,
      };
    },
  };

  return finder;
}
