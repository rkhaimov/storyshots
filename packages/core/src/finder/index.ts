import { Finder, FinderMeta } from './types';

export const finder = createFinder();

function createFinder(result: FinderMeta['consequent'] = []) {
  const finder: Finder = {
    getByRole: (role, options) =>
      createFinder([
        ...result,
        { type: 'locator', by: { type: 'role', role, options } },
      ]),
    getByText: (text, options) =>
      createFinder([
        ...result,
        { type: 'locator', by: { type: 'text', text, options } },
      ]),
    getByPlaceholder: (text, options) =>
      createFinder([
        ...result,
        { type: 'locator', by: { type: 'placeholder', text, options } },
      ]),
    getByTitle: (text, options) =>
      createFinder([
        ...result,
        { type: 'locator', by: { type: 'title', text, options } },
      ]),
    getByLabel: (text, options) =>
      createFinder([
        ...result,
        { type: 'locator', by: { type: 'label', text, options } },
      ]),
    getByAltText: (text, options) =>
      createFinder([
        ...result,
        { type: 'locator', by: { type: 'alt-text', text, options } },
      ]),
    getBySelector: (selector) =>
      createFinder([
        ...result,
        { type: 'locator', by: { type: 'selector', selector } },
      ]),
    r: (pattern) => ({
      flags: pattern.flags,
      source: pattern.source,
    }),
    get: (transformer) => transformer(finder),
    has: (element) =>
      createFinder([
        ...result,
        {
          type: 'filter',
          has: element.__toMeta(),
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
    at: (index) => createFinder([...result, { type: 'index', at: index }]),
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
