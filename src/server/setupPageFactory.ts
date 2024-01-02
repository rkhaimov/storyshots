import { Application } from 'express-serve-static-core';
import puppeteer, { Browser, Page } from 'puppeteer';
import { exhaustMap, Observable, switchMap } from 'rxjs';

// TODO: Implement basic ws channel
export function setupPageFactory(app: Application): Observable<Page> {
  const setup$ = new Observable<void>((subscriber) => {
    app.get('/api/storyshots/setup', async (_, response) => {
      subscriber.next(undefined);

      response.send();
    });
  });

  return setup$.pipe(
    // TODO: Proper cancellation
    exhaustMap(async () => {
      const browser = await createBrowserOnce();

      return findStoryshotsPage(browser);
    }),
    switchMap(async (page) => {
      page.click('aria/Increment[role="button"]');

      return page;
    }),
  );
}

const asyncOnce = <T>(func: () => Promise<T>): (() => Promise<T>) => {
  let last: T | undefined = undefined;

  return async () => {
    if (last === undefined) {
      last = await func();
    }

    return last;
  };
};

const createBrowserOnce = asyncOnce(() =>
  puppeteer.connect({
    browserURL: `http://127.0.0.1:9000`,
    defaultViewport: null,
  }),
);

async function findStoryshotsPage(browser: Browser): Promise<Page> {
  const pages = await browser.pages();

  const meta = await Promise.all(
    pages.map(async (it) => ({
      page: it,
      storyshots: await it.evaluate(() => window.storyshots),
    })),
  );

  const storyshots = meta.filter((it) => it.storyshots).map((it) => it.page);

  if (storyshots.length === 0) {
    const page = await browser.newPage();

    await page.goto('http://localhost:8080/');

    await page.bringToFront();

    return page;
  }

  const [first, ...rest] = storyshots;

  await first.bringToFront();

  await Promise.all(rest.map((it) => it.close()));

  return first;
}
