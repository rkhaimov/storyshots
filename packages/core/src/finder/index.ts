import { AriaRole } from 'react';
import { Finder, FinderFactory, FinderMeta } from './types';

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
  getByPlaceholder: (placeholder) =>
    createFinder({
      beginning: {
        type: 'selector',
        on: createPlaceholderSelector(placeholder),
      },
      consequent: [],
    }),
  getByLabel: (label) =>
    createFinder({
      beginning: {
        type: 'selector',
        on: createLabelSelector(label),
      },
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
    getByPlaceholder: (placeholder) =>
      createFinder({
        ...meta,
        consequent: [
          ...meta.consequent,
          {
            type: 'selector',
            on: createPlaceholderSelector(placeholder),
          },
        ],
      }),
    getByLabel: (label) =>
      createFinder({
        ...meta,
        consequent: [
          ...meta.consequent,
          {
            type: 'selector',
            on: createLabelSelector(label),
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

function createPlaceholderSelector(placeholder: string) {
  return `[placeholder="${placeholder}"]`;
}

function createLabelSelector(label: string) {
  return `label::-p-text(${label})`;
}
