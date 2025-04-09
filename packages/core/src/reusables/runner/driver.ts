import { createRegexpJSON } from '../regexpJSON';
import { IWebDriver } from '../types';
import { toManagerURL } from './toManagerURL';

export const driver: IWebDriver = {
  play: async (action) =>
    fetch(createURL('api/client/act'), {
      method: 'POST',
      body: createRegexpJSON(action),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()),
  test: (at, actions) =>
    fetch(createURL(`api/server/act/${at}`), {
      method: 'POST',
      body: createRegexpJSON(actions),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()),
  acceptScreenshot: async (screenshot) => {
    await fetch(createURL('api/screenshot/accept'), {
      method: 'POST',
      body: createRegexpJSON(screenshot),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  acceptRecords: async (record) => {
    await fetch(createURL(`api/record/accept`), {
      method: 'POST',
      body: createRegexpJSON(record),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  createImgSrc: (path) => createURL(`api/image/path?file=${path}`),
};

function createURL(url: string) {
  return toManagerURL(`http://localhost:6006/${url}`);
}
