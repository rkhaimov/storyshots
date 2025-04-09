/* eslint-disable react/react-in-jsx-scope */
import { callback } from '../reusables/preview/pure-function-factory';
import { CreateStories } from '../reusables/preview/stories';
import { describe, test } from '../reusables/test';
import { desktop } from './reusables/device';
import { StoryTree } from '@packages/core/src/core';

describe('errors', () => {
  test(
    'shows an error dedicated to passed story',
    desktop()
      .stories(render((error) => () => [error('is a story')]))
      .actor()
      .run('is a story')
      .screenshot()
      .do((page) => page.getByLabel('Progress').click())
      .screenshot()
      .do((page) => page.getByText('[desktop]').click())
      .screenshot(),
  );

  test(
    'shows several messages and opens all parent groups',
    desktop()
      .stories(
        render((error) => ({ describe }) => [
          describe('Group', [error('is first'), error('is second')]),
        ]),
      )
      .actor()
      .run('Group')
      .screenshot()
      .do((page) => page.getByLabel('Progress').click())
      .screenshot()
      .do((page) => page.getByText('[desktop]').first().click())
      .screenshot(),
  );
});

function render(
  factory: (error: (message: string) => StoryTree) => CreateStories<unknown>,
): CreateStories<unknown> {
  return callback(factory, ([args, _factory]) =>
    _factory((message) => {
      const text = `Submit ${message}`;

      return args.it(message, {
        act: (actor) => actor.click(args.finder.getByText(text)),
        render: () => (
          <div>
            <button>{text}</button>
            <button>{text}</button>
          </div>
        ),
      });
    })(args),
  );
}
