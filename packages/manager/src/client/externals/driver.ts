import { IWebDriver } from '../../reusables/types';

export const driver: IWebDriver = {
  actOnClientSide: async (action) =>
    fetch('/api/client/act', {
      method: 'POST',
      body: JSON.stringify(action),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()),
  actOnServerSide: (at, actions) =>
    fetch(`/api/server/act/${at}`, {
      method: 'POST',
      body: JSON.stringify(actions),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()),
  getExpectedScreenshots: (at, actions) =>
    fetch(`/api/screenshot/expected/${at}`, {
      method: 'POST',
      body: JSON.stringify(actions),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()),
  getExpectedRecords: (at, device) =>
    fetch(`/api/record/expected/${at}`, {
      method: 'POST',
      body: JSON.stringify(device),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()),
  areScreenshotsEqual: (screenshots) =>
    fetch('/api/screenshot/equals', {
      method: 'POST',
      body: JSON.stringify(screenshots),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()),
  acceptScreenshot: async (screenshot) => {
    await fetch('/api/screenshot/accept', {
      method: 'POST',
      body: JSON.stringify(screenshot),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  acceptRecords: async (at, payload) => {
    await fetch(`/api/record/accept/${at}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  createScreenshotPath: (path) => `/api/image/path?file=${path}`,
};
