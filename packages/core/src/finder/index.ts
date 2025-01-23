import {
  Finder,
  FinderMeta,
  JSONTextMatchOptions,
  JSONTextMatch,
  TextMatch,
} from './types';
import { isNil } from '../utils';

export const finder = createFinder();

function createFinder(result: FinderMeta['consequent'] = []) {
  const finder: Finder = {
    getByRole: (role, options) =>
      createFinder([
        ...result,
        {
          type: 'locator',
          by: { type: 'role', role, options: toJSONTextMatchOptions(options) },
        },
      ]),
    getByText: (text, options) =>
      createFinder([
        ...result,
        {
          type: 'locator',
          by: { type: 'text', text: toJSONTextMatch(text), options },
        },
      ]),
    getByPlaceholder: (text, options) =>
      createFinder([
        ...result,
        {
          type: 'locator',
          by: { type: 'placeholder', text: toJSONTextMatch(text), options },
        },
      ]),
    getByTitle: (text, options) =>
      createFinder([
        ...result,
        {
          type: 'locator',
          by: { type: 'title', text: toJSONTextMatch(text), options },
        },
      ]),
    getByLabel: (text, options) =>
      createFinder([
        ...result,
        {
          type: 'locator',
          by: { type: 'label', text: toJSONTextMatch(text), options },
        },
      ]),
    getByAltText: (text, options) =>
      createFinder([
        ...result,
        {
          type: 'locator',
          by: { type: 'alt-text', text: toJSONTextMatch(text), options },
        },
      ]),
    locator: (selector) =>
      createFinder([
        ...result,
        { type: 'locator', by: { type: 'selector', selector } },
      ]),
    get: (transformer) => transformer(finder),
    filter: (options) => {
      const converted = toJSONTextMatchOptions(options);

      return createFinder([
        ...result,
        {
          type: 'filter',
          options: {
            ...converted,
            has: isNil(converted.has) ? undefined : converted.has.__toMeta(),
            hasNot: isNil(converted.hasNot)
              ? undefined
              : converted.hasNot.__toMeta(),
          },
        },
      ]);
    },
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

// TODO: Simplify
function toJSONTextMatchOptions<T extends Record<string, unknown> | undefined>(
  options: T,
): undefined extends T ? undefined : JSONTextMatchOptions<T> {
  if (isNil(options)) {
    return undefined as never;
  }

  return Object.fromEntries(
    Object.entries(options).map(([key, value]) => [
      key,
      value instanceof RegExp
        ? {
            pattern: value.source,
            flags: value.flags,
          }
        : value,
    ]),
  ) as never;
}

function toJSONTextMatch(text: TextMatch): JSONTextMatch {
  return text instanceof RegExp
    ? {
        pattern: text.source,
        flags: text.flags,
      }
    : text;
}
