import { PureStoryTree } from '../../../reusables/story';
import {
  DevicePresets,
  CustomPresetGroup,
} from '../../../reusables/test-presets';
import { useBehaviour } from './index';

export type UseBehaviourProps = ReturnType<typeof useBehaviour>;

export type AppConfig = {
  stories: PureStoryTree[];
  devices: DevicePresets;
  presets: CustomPresetGroup<unknown>[];
};
