import { TestRunResult } from '../../../reusables/runner/types';
import { Props as ParentProps } from '../types';
import { Device, PureStory } from '@storyshots/core';

export type Props = ParentProps & {
  story: PureStory;
};

export type DeviceToTestRunResult = { device: Device; details: TestRunResult };
