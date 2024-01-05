import { Application } from 'express-serve-static-core';
import express from 'express';
import { Page } from 'puppeteer';
import { ActorMeta, FinderMeta } from '../reusables/actions';

export function createAPIHandlers(app: Application, page: Page) {
  app.use(express.json());

  app.post('/api/act', async (request, response) => {
    const actions: ActorMeta[] = request.body;

    for (const action of actions) {
      await act(page, action);
    }

    response.end();
  });
}

function act(page: Page, action: ActorMeta): Promise<void> {
  switch (action.action) {
    case 'click': {
      const on = toSelector(action.payload.on);

      console.log('CLICKING ON', on);

      return page.locator(on).click();
    }
  }
}

function toSelector(input: FinderMeta): string {
  switch (input.selector) {
    case 'aria': {
      const entries = Object.entries({
        role: input.payload.role,
        ...input.payload.attrs,
      });

      return `::-p-aria(${entries
        .map(([name, value]) => `[${name}="${value}"]`)
        .join('')})`;
    }
  }
}
