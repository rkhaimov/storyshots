import express, { RequestHandler, Router } from 'express';
import ws from 'express-ws';
import { regexpJSONReviver } from '../../../reusables/regexpJSON';
import { MANAGER_UNIQ_KEY } from '../../../reusables/runner/toManagerURL';
import { createUIHandler } from '../../createUIHandler';
import { createApiHandlers } from '../../handlers';
import { ManagerConfig } from '../../types';

export async function createServer(config: ManagerConfig) {
  const { app } = ws(express());
  const router = () => Router();

  const api = await createApiHandlers(router, config);
  const dynamic = createDynamicHandler();

  app.use(express.json({ reviver: regexpJSONReviver }));

  app.use(createPreviewHandler(config));
  app.use(api.router);
  app.use(dynamic.handler);
  app.use(createUIHandler());

  const listening = app.listen(6006);

  return {
    app,
    use: dynamic.set,
    router,
    cleanup: async () => {
      await config.preview.cleanup();

      await api.cleanup();

      listening.close();
    },
  };
}

export type Server = Awaited<ReturnType<typeof createServer>>;

function createPreviewHandler(config: ManagerConfig): RequestHandler {
  return (request, response, next) => {
    if (
      'manager' in request.query &&
      request.query.manager === MANAGER_UNIQ_KEY
    ) {
      return next();
    }

    return config.preview.handler(request, response, () =>
      response.status(404).send(),
    );
  };
}

function createDynamicHandler() {
  let handle: RequestHandler = (_, __, next) => next();

  const handler: RequestHandler = (rq, rs, nt) => handle(rq, rs, nt);

  return {
    handler,
    set: (next: RequestHandler) => (handle = next),
  };
}
