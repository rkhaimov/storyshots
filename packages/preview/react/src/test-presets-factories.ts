import {
  CompleteDeviceConfig,
  ViewPortOnlyDeviceConfig,
} from '@storyshots/core';

export function createDesktopDevice(
  name: string,
  viewport: ViewPortOnlyDeviceConfig['viewport'],
): ViewPortOnlyDeviceConfig {
  return {
    type: 'viewport-only',
    name,
    viewport,
  };
}

export function createMobileDevice(
  name: string,
  config: PartialDeviceConfig,
): CompleteDeviceConfig {
  return {
    type: 'complete',
    name,
    config: {
      userAgent: config.userAgent,
      viewport: {
        isMobile: true,
        hasTouch: true,
        isLandscape: false,
        ...config,
      },
    },
  };
}

type PartialDeviceConfig = {
  userAgent: string;
  width: number;
  height: number;
  deviceScaleFactor?: number;
};
