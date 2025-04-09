/* eslint-disable react/react-in-jsx-scope */
import { callback } from '../reusables/preview/pure-function-factory';
import { CreateStory, StoryConfig } from '../reusables/preview/stories';
import { describe, test } from '../reusables/test';
import { desktop } from './reusables/device';
import { ReadWriteExternals, rw } from './reusables/rw';

describe('utilizing recorder', () => {
  test(
    'allows to record calls',
    setup().run('is a story').open('Records').screenshot(),
  );

  test(
    'allows to catch calls changes',
    setup()
      .run('is a story')
      .accept('is a story')
      .preview()
      .story(render(() => <button>Write</button>))
      .actor()
      .run('is a story')
      .open('Records')
      .screenshot(),
  );

  test(
    'allows to accept new calls changes',
    setup()
      .run('is a story')
      .accept('is a story')
      .preview()
      .story(render(() => <button>Write</button>))
      .actor()
      .run('is a story')
      .accept('is a story')
      .open('Records')
      .screenshot(),
  );
});

function setup() {
  return desktop()
    .externals(rw())
    .story(
      render((externals) => (
        <button onClick={() => externals.write('User')}>Write</button>
      )),
    )
    .actor();
}

function render(
  _render: NonNullable<StoryConfig<ReadWriteExternals>['render']>,
): CreateStory<never> {
  return callback(_render, ([{ finder }, render]) => ({
    act: (actor) => actor.click(finder.getByText('Write')),
    render,
  }));
}
