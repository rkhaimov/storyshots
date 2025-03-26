/* eslint-disable react/react-in-jsx-scope */
import { callback } from '../reusables/preview/pure-function-factory';
import { CreateStory, StoryConfig } from '../reusables/preview/stories';
import { describe, test } from '../reusables/test';
import { desktop } from './reusables/device';

describe('writing a story', () => {
  test(
    'displays no stories by default',
    desktop()
      .stories(() => [])
      .actor()
      .screenshot(),
  );

  test('allows to define a story', setup().screenshot());

  test('allows to open a story', setup().open('is a story').screenshot());

  test(
    'captures story changes on live',
    setup()
      .open('is a story')
      .preview()
      .story(render(() => <h1>Changed</h1>))
      .actor()
      .screenshot(),
  );

  test(
    'allows to generate fresh baseline',
    setup()
      .run('is a story')
      .screenshot()
      .open('Records')
      .screenshot()
      .open('FINAL')
      .screenshot(),
  );

  test(
    'allows to save baseline',
    setup().run('is a story').accept('is a story').screenshot(),
  );

  test(
    'allows to catch visual changes',
    setup()
      .run('is a story')
      .accept('is a story')
      .preview()
      .story(render(() => <h1>Hello</h1>))
      .actor()
      .run('is a story')
      .open('FINAL')
      .screenshot()
      .do((page) => page.getByText('2-up').click())
      .screenshot(),
  );

  test(
    'allows to accept new changes',
    setup()
      .run('is a story')
      .accept('is a story')
      .preview()
      .story(render(() => <h1>Hello</h1>))
      .actor()
      .run('is a story')
      .accept('is a story')
      .open('FINAL')
      .screenshot(),
  );
});

function setup() {
  return desktop()
    .story(render(() => <h1>Hello, App!</h1>))
    .actor();
}

function render(
  _render: NonNullable<StoryConfig<unknown>['render']>,
): CreateStory<unknown> {
  return callback(_render, ([, render]) => ({ render }));
}
