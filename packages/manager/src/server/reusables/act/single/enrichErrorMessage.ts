import { ActionMeta, FinderMeta, ScreenshotAction } from '@storyshots/core';
import { TIMEOUT } from './constants';

export function enrichErrorMessage(
  error: string,
  action: Exclude<ActionMeta, ScreenshotAction>,
) {
  switch (action.action) {
    case 'click':
    case 'fill':
    case 'hover':
    case 'scrollTo':
    case 'select':
      return `${error} ${action.action}(${selectorToString(
        action.payload.on,
      )}) during ${TIMEOUT} ms`;
    case 'uploadFile':
    case 'wait':
    case 'keyboard':
      return `${error} ${action.action}() during ${TIMEOUT} ms`;
  }
}

function selectorToString(by: FinderMeta): string {
  return `${by.beginning.on} ${by.consequent
    .map((it): string => {
      switch (it.type) {
        case 'selector':
          return it.on;
        case 'index':
          return `[${it.at}]`;
        case 'filter':
          return `has(${selectorToString(it.has)})`;
        case 'and':
          return `and(${selectorToString(it.condition)})`;
      }
    })
    .join(' ')}`;
}
