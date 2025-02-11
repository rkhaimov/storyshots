import { IWebDriver } from '../types';
import { createRegexpJSON } from '../regexpJSON';

export const driver: IWebDriver = {
  play: async (action) =>
    fetch('http://localhost:6006/api/client/act', {
      method: 'POST',
      body: createRegexpJSON(action),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()),
  test: (at, actions) =>
    fetch(`http://localhost:6006/api/server/act/${at}`, {
      method: 'POST',
      body: createRegexpJSON(actions),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()),
  acceptScreenshot: async (screenshot) => {
    await fetch('http://localhost:6006/api/screenshot/accept', {
      method: 'POST',
      body: createRegexpJSON(screenshot),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  acceptRecords: async (record) => {
    await fetch(`http://localhost:6006/api/record/accept`, {
      method: 'POST',
      body: createRegexpJSON(record),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  // TODO: Force all urls to be wrapped with createManagerRequest
  createImgSrc: (path) =>
    `http://localhost:6006/api/image/path?file=${path}&manager=SECRET`,
};
