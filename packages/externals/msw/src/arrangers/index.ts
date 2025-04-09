import { Arrangers, UnknownArrangers } from '../../../../arrangers';
import { Endpoints, UnknownEndpoint } from '../types';
import { MSWArrangers, UnknownMSWArrangers } from './types';
import { body, params, query } from '../utils';

export function createMSWArrangers<TExternals>(
  arrangers: Arrangers<TExternals, Endpoints>,
) {
  return _create(arrangers as UnknownArrangers) as MSWArrangers<TExternals>;
}

function _create(arrangers: UnknownArrangers): UnknownMSWArrangers {
  return {
    endpoint: (name, endpoint) => arrangers.set(name, endpoint),
    handle: (name, handle) => arrangers.set(`${name}.handle`, handle),
    record: (...names) =>
      arrangers.arrange(
        ...names.map((name) =>
          arrangers.compose(`${name}.handle`, (_origin, config) => {
            const origin = _origin as UnknownEndpoint['handle'];

            const handler: UnknownEndpoint['handle'] = async (args) => {
              config.journal.record(name, {
                query: query(args),
                params: params(args),
                body: await body(args),
              });

              return origin(args);
            };

            return handler;
          }),
        ),
      ),
  };
}
