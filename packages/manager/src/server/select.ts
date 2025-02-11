import {
  ByIndex,
  ByLocator,
  FinderMeta,
  isNil,
  WithAnd,
  WithFilter,
} from '@storyshots/core';
import { Frame, Locator } from 'playwright';

export function select(preview: Frame, on: FinderMeta): Locator {
  const beginning = byLocator(preview, on.beginning);

  return on.consequent.reduce((result, selector) => {
    switch (selector.type) {
      case 'locator':
        return byLocator(result, selector);
      case 'index':
        return byIndex(result, selector);
      case 'filter':
        return withFilter(preview, result, selector);
      case 'and':
        return withAnd(preview, result, selector);
    }
  }, beginning);
}

function byIndex(element: Locator, finder: ByIndex) {
  switch (finder.options.kind) {
    case 'first':
      return element.first();
    case 'last':
      return element.last();
    case 'nth':
      return element.nth(finder.options.at);
  }
}

function withFilter(frame: Frame, element: Locator, filter: WithFilter) {
  const options = filter.options;

  return element.filter({
    has: isNil(options.has) ? undefined : select(frame, options.has),
    hasNot: isNil(options.hasNot) ? undefined : select(frame, options.hasNot),
    hasText: options.hasText,
    hasNotText: options.hasNotText,
  });
}

function withAnd(frame: Frame, element: Locator, finder: WithAnd) {
  return element.and(select(frame, finder.condition));
}

function byLocator(element: Frame | Locator, finder: ByLocator): Locator {
  switch (finder.by.type) {
    case 'selector':
      return element.locator(finder.by.selector);
    case 'role':
      return element.getByRole(finder.by.role, finder.by.options);
    case 'text':
      return element.getByText(finder.by.text, finder.by.options);
    case 'label':
      return element.getByLabel(finder.by.text, finder.by.options);
    case 'placeholder':
      return element.getByPlaceholder(finder.by.text, finder.by.options);
    case 'alt-text':
      return element.getByAltText(finder.by.text, finder.by.options);
    case 'title':
      return element.getByTitle(finder.by.text, finder.by.options);
  }
}
