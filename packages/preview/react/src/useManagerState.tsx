import {
  PresetConfigName,
  PresetName,
  PurePresetGroup,
  PureStoryTree,
  TreeOP,
} from '@storyshots/core';
import { useMemo } from 'react';
import { createActor } from './actor';
import { Props, StoryTree, UserDefinedPresetGroup } from './types';

export function useManagerState(props: Props) {
  return useMemo(
    () =>
      props.externals.createManagerConnection({
        stories: toPureStories(props.stories),
        devices: props.devices,
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
      actions: leaf.act(createActor()).toMeta(),
    }),
  });
}

function toPurePresets(
  presets: UserDefinedPresetGroup<unknown>[],
): PurePresetGroup[] {
  return presets.map((group) => ({
    name: group.name as PresetConfigName,
    default: group.default as PresetName,
    additional: group.additional.map((preset) => preset.name as PresetName),
  }));
}
