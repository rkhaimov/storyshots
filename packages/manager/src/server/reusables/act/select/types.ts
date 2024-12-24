import { ElementHandle } from 'puppeteer';

export type ElementAssertion = (element: ElementHandle) => Promise<void>;
