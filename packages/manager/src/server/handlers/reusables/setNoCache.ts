import { Response } from 'express-serve-static-core';

export function setNoCache(response: Response) {
  response.setHeader('Surrogate-Control', 'no-store');

  response.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  );

  response.setHeader('Expires', '0');
}
