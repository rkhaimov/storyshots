/* eslint-disable react/react-in-jsx-scope */
import { describe, test } from '../reusables/test';
import { desktop } from './reusables/device';
import { rw } from './reusables/rw';

describe('emulating behaviour', () => {
  test(
    'allows to emulate behaviour',
    desktop()
      .externals(rw())
      .story(({ useState, finder }) => ({
        arrange: () => {
          let name = 'Ivan';

          return {
            read: () => name,
            write: (_name) => void (name = _name),
          };
        },
        act: (actor) =>
          actor.screenshot('Initial').click(finder.getByText('Update')),
        render: ({ read, write }) => {
          const [name, setName] = useState(read());

          return (
            <div>
              <h1>{name}</h1>
              <button
                onClick={() => {
                  write('Vasiliy');

                  setName(read());
                }}
              >
                Update
              </button>
            </div>
          );
        },
      }))
      .actor()
      .run('is a story')
      .open('Records')
      .screenshot()
      .open('Initial')
      .screenshot()
      .open('FINAL')
      .screenshot(),
  );
});
