import {
  Device,
  PresetConfigName,
  PresetGroup,
  PresetName,
  PureStoryTree,
  TreeOP,
} from '@storyshots/core';
import { useMemo } from 'react';
import { PreviewProps, StoryTree, UserDefinedPresetGroup } from './types';

export function useManagerState(props: PreviewProps) {
  return useMemo(
    () =>
      props.externals.createManagerConnection({
        retries: props.retries,
        stories: toPureStories(props.stories),
        devices: props.devices as Device[],
        presets: toPurePresets(props.presets),
      }),
    [props.stories],
  );
}

function toPureStories(nodes: StoryTree[]): PureStoryTree[] {
  return TreeOP.map(nodes, {
    node: (node) => node,
    leaf: (leaf) => ({
      title: leaf.title,
      act: leaf.act,
    }),
  });
}

function toPurePresets(presets: UserDefinedPresetGroup[]): PresetGroup[] {
  return presets.map((group) => ({
    name: group.name as PresetConfigName,
    default: group.default as PresetName,
    others: group.additional as PresetName[],
  }));
}
