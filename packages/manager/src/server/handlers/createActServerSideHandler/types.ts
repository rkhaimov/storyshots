import { Story } from '../../reusables/types';
import { ManagerConfig } from '../../types';
import { Baseline } from '../reusables/baseline';

export type BasePayload = {
  story: Story;
  baseline: Baseline;
  config: ManagerConfig;
};
