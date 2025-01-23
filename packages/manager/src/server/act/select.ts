import {
  ByLocator,
  ByRole,
  FinderMeta,
  isNil,
  RegExpMatcher,
  WithAnd,
} from '@storyshots/core';
import { ByIndex, WithFilter } from '@storyshots/core/src';
import { Frame, Locator, type Page } from 'playwright';

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
  return element.nth(finder.at);
}

function withFilter(frame: Frame, element: Locator, finder: WithFilter) {
  return element.filter({ has: select(frame, finder.has) });
}

function withAnd(frame: Frame, element: Locator, finder: WithAnd) {
  return element.and(select(frame, finder.condition));
}

function byLocator(element: Frame | Locator, finder: ByLocator): Locator {
  switch (finder.by.type) {
    case 'selector':
      return element.locator(finder.by.selector);
    case 'role':
      return element.getByRole(
        finder.by.role,
        fromRoleOptions(finder.by.options),
      );
    case 'text':
      return element.getByText(fromMatcher(finder.by.text), finder.by.options);
    case 'label':
      return element.getByLabel(fromMatcher(finder.by.text), finder.by.options);
    case 'placeholder':
      return element.getByPlaceholder(
        fromMatcher(finder.by.text),
        finder.by.options,
      );
    case 'alt-text':
      return element.getByAltText(
        fromMatcher(finder.by.text),
        finder.by.options,
      );
    case 'title':
      return element.getByTitle(fromMatcher(finder.by.text), finder.by.options);
  }
}

function fromMatcher(matcher: string | RegExpMatcher): string | RegExp {
  if (typeof matcher === 'string') {
    return matcher;
  }

  return new RegExp(matcher.source, matcher.flags);
}

function fromRoleOptions(
  options: ByRole['options'],
): Parameters<Page['getByRole']>[1] {
  if (isNil(options)) {
    return;
  }

  const name = options.name;

  if (isNil(name)) {
    return options as Parameters<Page['getByRole']>[1];
  }

  return { ...options, name: fromMatcher(name) };
}
