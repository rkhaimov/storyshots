import type { AriaRole } from 'react';
import { ScreenshotName } from './types';

type ClickAction = {
  action: 'click';
  payload: {
    on: SelectorMeta;
  };
};

export type ScreenshotAction = {
  action: 'screenshot';
  payload: {
    name: ScreenshotName;
  };
};

export type ActionMeta = ClickAction | ScreenshotAction;

export type SelectorMeta = {
  selector: 'aria';
  payload: {
    role: AriaRole;
    attrs?: AriaAttrs;
  };
};

export type AriaAttrs = {
  name: string;
  [key: string]: string;
};
