import { IWebDriver } from '../types';

export const driver: IWebDriver = {
  actOnClientSide: async (action) =>
    fetch('http://localhost:6006/api/client/act', {
      method: 'POST',
      body: JSON.stringify(action),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()),
  actOnServerSide: (at, actions) =>
    fetch(`http://localhost:6006/api/server/act/${at}`, {
      method: 'POST',
      body: JSON.stringify(actions),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()),
  acceptScreenshot: async (screenshot) => {
    await fetch('http://localhost:6006/api/screenshot/accept', {
      method: 'POST',
      body: JSON.stringify(screenshot),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  acceptRecords: async (at, payload) => {
    await fetch(`http://localhost:6006/api/record/accept/${at}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  // TODO: Force all urls to be wrapped with createManagerRequest
  createScreenshotPath: (path) =>
    `http://localhost:6006/api/image/path?file=${path}&manager=SECRET`,
};
