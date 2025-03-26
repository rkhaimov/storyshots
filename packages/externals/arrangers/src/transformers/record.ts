import { compose } from './compose';
import { arrange } from './arrange';
import { assert } from '@lib';
import { UnknownArrangers } from '../arrangers-types';

export const record: UnknownArrangers['record'] = (...paths) =>
  arrange(
    ...paths.map((path) =>
      compose(path, (method, config) => {
        assert(
          typeof method === 'function',
          `Record expects function key, but found ${typeof method} by ${path}`,
        );

        return config.journal.asRecordable(path, method as never);
      }),
    ),
  );
