import { ElementHandle } from 'puppeteer';

export type ElementGuard = (
  element: ElementHandle,
) => Promise<{ pass: true } | { pass: false; reason: string }>;
