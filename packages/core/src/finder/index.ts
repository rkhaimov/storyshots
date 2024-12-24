import { AriaRole } from 'react';
import { Finder, FinderMeta } from './types';

export const finder = createFinder();

function createFinder(result: FinderMeta['consequent'] = []) {
  const finder: Finder = {
    getByRole: (role, attrs) =>
      finder.getBySelector(createAriaSelector(role, attrs)),
    getByText: (substring) =>
      finder.getBySelector(createTextSelector(substring)),
    getByPlaceholder: (placeholder) =>
      finder.getBySelector(createPlaceholderSelector(placeholder)),
    getByTitle: (title) => finder.getBySelector(createTitleSelector(title)),
    getByLabel: (label) => finder.getBySelector(createLabelSelector(label)),
    get: (transformer) => transformer(finder),
    getBySelector: (selector) =>
      createFinder([...result, { type: 'selector', on: selector }]),
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

      if (beginning.type !== 'selector') {
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

function createAriaSelector(
  role: AriaRole,
  attrs: Record<string, string> | undefined,
) {
  const entries = Object.entries({ role, ...attrs });

  return `::-p-aria(${entries
    .map(([name, value]) => `[${name}="${value}"]`)
    .join('')})`;
}

function createTextSelector(substring: string) {
  return `::-p-text(${substring})`;
}

function createPlaceholderSelector(placeholder: string) {
  return `[placeholder="${placeholder}"]`;
}

function createTitleSelector(title: string) {
  return `[title="${title}"]`;
}

function createLabelSelector(label: string) {
  return `label::-p-text(${label}), [aria-label="${label}"]`;
}
