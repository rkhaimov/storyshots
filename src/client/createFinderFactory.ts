import { AriaRole } from 'react';
import { FinderMeta } from '../reusables/finder';
import { Finder, FinderFactory } from './types';

export const finder: FinderFactory = {
  getByRole: (role, attrs) =>
    createFinder({
      beginning: { type: 'selector', on: createAriaSelector(role, attrs) },
      consequent: [],
    }),
  getByText: (substring) =>
    createFinder({
      beginning: { type: 'selector', on: createTextSelector(substring) },
      consequent: [],
    }),
  getBySelector: (selector) =>
    createFinder({
      beginning: { type: 'selector', on: selector },
      consequent: [],
    }),
};

function createFinder(meta: FinderMeta): Finder {
  return {
    getBySelector: (selector) =>
      createFinder({
        ...meta,
        consequent: [...meta.consequent, { type: 'selector', on: selector }],
      }),
    getByRole: (role, attrs) =>
      createFinder({
        ...meta,
        consequent: [
          ...meta.consequent,
          {
            type: 'selector',
            on: createAriaSelector(role, attrs),
          },
        ],
      }),
    getByText: (substring) =>
      createFinder({
        ...meta,
        consequent: [
          ...meta.consequent,
          {
            type: 'selector',
            on: createTextSelector(substring),
          },
        ],
      }),
    has: (element) =>
      createFinder({
        ...meta,
        consequent: [
          ...meta.consequent,
          {
            type: 'filter',
            has: element.toMeta(),
          },
        ],
      }),
    at: (index) =>
      createFinder({
        ...meta,
        consequent: [...meta.consequent, { type: 'index', at: index }],
      }),
    toMeta: () => meta,
  };
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
