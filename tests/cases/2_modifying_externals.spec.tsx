/* eslint-disable react/react-in-jsx-scope */
import { describe, test } from '../reusables/test';
import { desktop } from './reusables/device';
import { rw } from './reusables/rw';

describe('modifying externals', () => {
  test(
    'provides default behaviour',
    desktop()
      .externals(rw())
      .story(() => ({ render: ({ read }) => <h1>{read()}</h1> }))
      .actor()
      .open('is a story')
      .screenshot(),
  );

  test(
    'allows to replace externals behaviour using arrange',
    desktop()
      .externals(rw())
      .story(() => ({
        arrange: (externals) => ({ ...externals, read: () => 'Vasiliy' }),
        render: ({ read }) => <h1>{read()}</h1>,
      }))
      .actor()
      .open('is a story')
      .screenshot(),
  );
});
