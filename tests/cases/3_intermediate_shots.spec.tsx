/* eslint-disable react/react-in-jsx-scope */
import { callback } from '../reusables/preview/pure-function-factory';
import { CreateStory } from '../reusables/preview/stories';
import { describe, test } from '../reusables/test';
import { desktop } from './reusables/device';

describe('intermediate shots', () => {
  test(
    'allows to define intermediate shots',
    setup()
      .open('EmailFilled')
      .screenshot()
      .open('MessageFilled')
      .screenshot()
      .open('FINAL')
      .screenshot(),
  );

  test('allows to accept all', setup().accept('is a story').screenshot());

  test(
    'checks each shot separately',
    setup()
      .accept('is a story')
      .preview()
      .story(render(() => <textarea placeholder="Message:" />))
      .actor()
      .run('is a story')
      .open('EmailFilled')
      .do((page) => page.getByText('2-up').click())
      .screenshot(),
  );
});

function setup() {
  return desktop().story(render()).actor().run('is a story');
}

function render(
  field = () => <input type="text" placeholder="Message:" />,
): CreateStory<unknown> {
  return callback(field, ([{ useState, finder }, _field]) => ({
    act: (actor) =>
      actor
        .fill(finder.getByPlaceholder('Email'), 'example@mail.com')
        .screenshot('EmailFilled')
        .fill(finder.getByPlaceholder('Message'), 'Hello.')
        .screenshot('MessageFilled')
        .click(finder.getByText('Send')),
    render: () => {
      const [sent, setSent] = useState(false);

      if (sent) {
        return <h1>Sent</h1>;
      }

      return (
        <form>
          <input type="email" placeholder="Email:" />
          {_field()}
          <button onClick={() => setSent(true)}>Send</button>
        </form>
      );
    },
  }));
}
