import { StoryConfig } from '@storyshots/core';
import { GetByPath, PathsOf } from './path-types';

export type UnknownArrangers = {
  focus(path: string): UnknownArrangers;
  record(...paths: string[]): UnknownArranger;
  set(path: string, value: unknown): UnknownArranger;
  arrange(...arrangers: UnknownArranger[]): UnknownArranger;
  iterated(
    values: unknown[],
    transform: (next: () => unknown) => UnknownArranger,
  ): UnknownArranger;
  compose(
    path: string,
    transform: (value: unknown, config: StoryConfig) => unknown,
  ): UnknownArranger;
};

export type UnknownArranger = (
  externals: unknown,
  config: StoryConfig,
) => unknown;

export type Arrangers<TExternals, TFocus> = {
  arrange(...arrangers: Arranger<TExternals>[]): Arranger<TExternals>;

  iterated<T>(
    values: T[],
    transform: (next: () => T) => Arranger<TExternals>,
  ): Arranger<TExternals>;

  set<TPath extends PathsOf<TFocus>>(
    path: TPath,
    value: GetByPath<TPath, TFocus>,
  ): Arranger<TExternals>;

  compose<TPath extends PathsOf<TFocus>>(
    path: TPath,
    transform: (
      value: GetByPath<TPath, TFocus>,
      config: StoryConfig,
    ) => GetByPath<TPath, TFocus>,
  ): Arranger<TExternals>;

  record<TPath extends PathsOf<TFocus>>(
    ...paths: TPath[]
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): GetByPath<TPath, TFocus> extends Function ? Arranger<TExternals> : unknown;

  focus<TPath extends PathsOf<TFocus>>(
    path: TPath,
  ): Arrangers<TExternals, GetByPath<TPath, TFocus>>;
};

export type Arranger<TExternals> = (
  externals: TExternals,
  config: StoryConfig,
) => TExternals;
