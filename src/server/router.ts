import { RequestHandler } from 'express';

import { StoryID } from '../reusables/types';
import { not } from '../reusables/utils';

export const router: RequestHandler = (request, response, next) => {
  const query = request.method === 'GET' || request.method === 'HEAD';

  if (not(query)) {
    return next();
  }

  if (request.url.lastIndexOf('.') > request.url.lastIndexOf('/')) {
    return next();
  }

  if (request.headers.accept?.indexOf('text/html') === -1) {
    return next();
  }

  const manager =
    'manager' in request.query && request.query.manager === 'SECRET';

  request.url = manager ? '/manager/index.html' : '/preview/index.html';

  return next();
};

// TODO: Deduplicate constants and url matching logic (client including)
export const PORT = 6006;
export const MANAGER_INDEX = `http://localhost:6006?manager=SECRET`;
export const createPathToStory = (id: StoryID) =>
  `http://localhost:6006/chromium/${id}?manager=SECRET`;
