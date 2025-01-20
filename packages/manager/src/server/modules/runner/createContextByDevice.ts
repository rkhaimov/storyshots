import { Browser } from 'playwright';
import { Story } from '../../reusables/types';

export async function createContextByDevice(
  {
    payload: {
      config: { device },
    },
  }: Story,
  browser: Browser,
) {
  switch (device.type) {
    case 'size-only':
      return browser.newContext({ viewport: device.config });
    case 'emulated':
      return browser.newContext({
        viewport: device.config,
        userAgent: device.config.userAgent,
      });
  }
}
