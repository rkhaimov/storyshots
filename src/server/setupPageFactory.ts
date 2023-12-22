import { Application } from 'express-serve-static-core';
import puppeteer, { Browser, Page } from 'puppeteer';
import {
  bindCallback,
  concatMap,
  mergeScan,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import {
  parseStoryshotsPageId,
  StoryshotsPageId,
} from '../reusables/storyshotsPageId';
import { createAsyncDisposableResource } from './createAsyncDisposableResource';

export function setupPageFactory(
  app: Application,
  debugPort: number,
): Observable<Page | undefined> {
  const id$ = new Observable<StoryshotsPageId>((subscriber) => {
    app.get('/api/storyshots/setup/:id', async (request, response) => {
      subscriber.next(parseStoryshotsPageId(request.params.id));

      response.send();
    });
  });

  id$.pipe(mergeScan((browser, it) => {}, undefined as Browser | undefined, 1));

  return id$.pipe(
    switchMap((id) =>
      createAsyncDisposableResource(async () => {
        console.log('CREATING!!!');
        const browser = await puppeteer.connect({
          browserURL: `http://127.0.0.1:${debugPort}`,
          defaultViewport: null,
        });

        const page = await createPuppeteerPage(browser, id);

        return [
          page,
          () => {
            console.log('CLOSING!!!');
            browser.close();
          },
        ];
      }),
    ),
  );
}

async function createPuppeteerPage(
  browser: Browser,
  id: StoryshotsPageId,
): Promise<Page | undefined> {
  const pages = await browser.pages();

  const r = await Promise.all(
    pages.map(async (it) => ({
      page: it,
      id: await it.evaluate(() => (window as { id?: StoryshotsPageId }).id),
    })),
  );

  console.log(r);

  return undefined;
}
