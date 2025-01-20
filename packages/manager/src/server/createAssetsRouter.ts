import { RequestHandler } from 'express';
import wsify from 'express-ws';

export function createAssetsRouter(
  app: wsify.Application,
  preview: RequestHandler,
  manager: RequestHandler,
) {
  app.use((request, response, next) => {
    const query = request.method === 'GET' || request.method === 'HEAD';

    if (!query) {
      return next();
    }

    if (!('manager' in request.query && request.query.manager === 'SECRET')) {
      return preview(request, response, next);
    }

    if (request.path.includes('/api/')) {
      return next();
    }

    const file = request.path.lastIndexOf('.') > request.path.lastIndexOf('/');

    request.url = file ? request.url : '/index.html';

    return manager(request, response, next);
  });
}
