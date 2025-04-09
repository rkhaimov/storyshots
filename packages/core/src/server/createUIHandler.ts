import express, { RequestHandler } from 'express';
import path from 'path';

function createPrebuiltManager(): RequestHandler {
  const ui = path.join(
    path.dirname(require.resolve('@storyshots/core/package.json')),
    'lib',
    'client',
  );

  const onFile = express.static(ui);

  return (request, response, next) => {
    const file = request.path.lastIndexOf('.') > request.path.lastIndexOf('/');

    request.url = file ? request.url : '/index.html';

    return onFile(request, response, next);
  };
}

export const createUIHandler = createPrebuiltManager;
