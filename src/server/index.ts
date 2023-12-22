import { Application } from 'express-serve-static-core';
import { Observable } from 'rxjs';
import { setupPageFactory } from './setupPageFactory';

export const setup = (
  app: Application,
  debugPort: number,
): Observable<unknown> => setupPageFactory(app, debugPort);
