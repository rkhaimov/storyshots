import { Brand } from './brand';
import { Journal } from './journal/types';

/**
 * Configuration settings for a story, including device information and testing flag.
 */
export type StoryConfig = {
  /** The device configuration used in the story. */
  device: Device;
  /**
   * Indicates the mode in which the story is running.
   * - `true`: The story is running in the background (e.g., testing mode).
   * - `false`: The story is running in the manager in playing mode.
   *
   * This property is useful for disabling certain behaviors during testing, such as animations and other non-deterministic
   * actions/data, to ensure consistent and reliable test results.
   */
  testing: boolean;
};

/**
 * Extended story configuration that includes journal information.
 */
export type JournalStoryConfig = StoryConfig & {
  journal: Journal;
};

export type DeviceName = Brand<string, 'DeviceName'>;

/**
 * Represents a device configuration. Can be {@link SizeOnly} or {@link Emulated}
 */
export type Device = SizeOnly | Emulated;

/**
 * Configuration for a device that specifies only its size. User agent stays intact
 *
 * @example
 * // Example usage of SizeOnly configuration
 * devices: [{
 *   type: 'size-only',
 *   name: 'desktop',
 *   config: {
 *     width: 1480,
 *     height: 920,
 *     deviceScaleFactor: 2,
 *   },
 * }];
 */
export type SizeOnly = {
  type: 'size-only';
  name: DeviceName;
  config: {
    width: number;
    height: number;
    deviceScaleFactor?: number;
  };
};

/**
 * Configuration for an emulated device.
 *
 * For a list of available user agents:
 * {@link https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json}
 *
 * @example
 * // Example usage of Emulated device configuration
 * devices: [{
 *   type: 'emulated',
 *   name: 'mobile',
 *   config: {
 *     userAgent:
 *       'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
 *     width: 414,
 *     height: 896,
 *     deviceScaleFactor: 3,
 *   },
 * }];
 */
export type Emulated = {
  type: 'emulated';
  name: DeviceName;
  config: {
    userAgent: string;
    width: number;
    height: number;
    deviceScaleFactor?: number;
    isLandscape?: boolean;
  };
};
