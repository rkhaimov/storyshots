import { Device, Story } from '@core';
import { TestRunResult } from '../../../reusables/runner/types';
import { Props as ParentProps } from '../types';

export type Props = ParentProps & {
  story: Story;
};

export type DeviceToTestRunResult = { device: Device; details: TestRunResult };
