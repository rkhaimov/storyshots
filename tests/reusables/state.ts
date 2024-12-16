import type { Application } from 'express-serve-static-core';
import { PreviewBuilder } from './preview';

type State = { data: number };

// State lives in context of current running test
export function withStatefulHandlers(app: Application, initial = 0) {
  let state: State = { data: initial };
  app.post('/api/state/set', (request, response) => {
    state = request.body;

    return response.end();
  });

  app.post('/api/state/get', (_, response) => response.json(state));
}

export function withStatefulExternals<T>(pb: PreviewBuilder<T>) {
  return pb.externals(() => ({
    createExternals: () => ({
      get: () =>
        fetch('/api/state/get', { method: 'POST' })
          .then((response) => response.json())
          .then((body) => body as State),
      update: (curr: State) => {
        const next = { data: curr.data + 1 };

        return fetch('/api/state/set', {
          method: 'POST',
          body: JSON.stringify(next),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      },
    }),
    createJournalExternals: ({ get, update }, { journal }) => ({
      get,
      update: journal.asRecordable('update', update),
    }),
  }));
}
