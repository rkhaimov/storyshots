import {
  ByLocator,
  FinderMeta,
  isNil,
  JSONTextMatch,
  TextMatch,
  TextMatchOptions,
  WithAnd,
} from '@storyshots/core';
import { ByIndex, WithFilter } from '@storyshots/core/src';
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
  const parsed = toTextMatchOptions(filter.options);

  return element.filter({
    has: isNil(parsed.has) ? undefined : select(frame, parsed.has),
    hasNot: isNil(parsed.hasNot) ? undefined : select(frame, parsed.hasNot),
    hasText: parsed.hasText,
    hasNotText: parsed.hasNotText,
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
      return element.getByRole(
        finder.by.role,
        toTextMatchOptions(finder.by.options),
      );
    case 'text':
      return element.getByText(toTextMatch(finder.by.text), finder.by.options);
    case 'label':
      return element.getByLabel(toTextMatch(finder.by.text), finder.by.options);
    case 'placeholder':
      return element.getByPlaceholder(
        toTextMatch(finder.by.text),
        finder.by.options,
      );
    case 'alt-text':
      return element.getByAltText(
        toTextMatch(finder.by.text),
        finder.by.options,
      );
    case 'title':
      return element.getByTitle(toTextMatch(finder.by.text), finder.by.options);
  }
}

function toTextMatchOptions<T extends Record<string, unknown> | undefined>(
  options: T,
): undefined extends T ? undefined : TextMatchOptions<T> {
  if (isNil(options)) {
    return undefined as never;
  }

  return Object.fromEntries(
    Object.entries(options).map(([key, value]) => [
      key,
      typeof value === 'object' &&
      value !== null &&
      'pattern' in value &&
      'flags' in value
        ? new RegExp(value.pattern as string, value.flags as string)
        : value,
    ]),
  ) as never;
}

function toTextMatch(text: JSONTextMatch): TextMatch {
  return typeof text === 'string' ? text : new RegExp(text.pattern, text.flags);
}
