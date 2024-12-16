import type { createPreviewApp } from '@storyshots/react-preview';

type Dependencies = typeof import('@storyshots/react-preview') &
  typeof import('react') &
  typeof import('@storyshots/core');

type CreatePreviewApp<T> = typeof createPreviewApp<T>;

type Config<T> = Parameters<CreatePreviewApp<T>>[0];

type StoryUtils<T> = Pick<ReturnType<CreatePreviewApp<T>>, 'describe' | 'it'> &
  Dependencies;

type RunUtils<T> = {
  config: Config<T>;
  stories(utils: StoryUtils<T>): Array<Stories<T>>;
} & Dependencies;

type Stories<T> = ReturnType<StoryUtils<T>['it' | 'describe']>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PreviewBuilder<T = any> = {
  tap<R>(on: (pb: PreviewBuilder<T>) => PreviewBuilder<R>): PreviewBuilder<R>;
  externals<R>(transform: ExternalsFactory<R>): PreviewBuilder<T & R>;
  devices(transform: DevicesFactory): PreviewBuilder<T>;
  stories(build: StoriesFactory<T>): PreviewBuilder<T>;
  entry(handle: EntryHandler<T>): PreviewBuilder<T>;
  toEntry(): string;
};

type DevicesFactory = () => Config<unknown>['devices'];

type ExternalsFactory<T> = () => Pick<
  Config<T>,
  'createJournalExternals' | 'createExternals'
>;

type StoriesFactory<T> = (utils: StoryUtils<T>) => Array<Stories<T>>;

type EntryHandler<T> = (utils: RunUtils<T>) => void;

export function preview() {
  const externalsCreators: Array<ExternalsFactory<UnknownExternals>> = [];

  let createDevices: DevicesFactory = () => [
    {
      type: 'size-only',
      name: 'desktop',
      config: { width: 1280, height: 720 },
    },
  ];

  let createStories: StoriesFactory<unknown> = () => [];

  let onEntry: EntryHandler<unknown> = (utils) => {
    const { run, describe, it } = utils.createPreviewApp(utils.config);

    run(utils.stories({ it, describe, ...utils }));
  };

  const result: PreviewBuilder = {
    devices: (transform) => {
      createDevices = transform;

      return result;
    },
    externals: (transform) => {
      externalsCreators.push(transform as ExternalsFactory<UnknownExternals>);

      return result;
    },
    stories: (build) => {
      createStories = build;

      return result;
    },
    entry: (run) => {
      onEntry = run;

      return result;
    },
    tap: (on) => on(result),
    toEntry: () => {
      const code = `
        import React from 'react';
        import * as core from '@storyshots/core';
        import * as preview from '@storyshots/react-preview';
        
        const utils = { ...React, ...core, ...preview };
        
        (${onEntry.toString()})({
          ...utils,
          stories: ${createStories.toString()},
          config: (${buildConfig.toString()})(
            ${createDevices.toString()},
            ${externalsCreators.map((it) => it.toString()).join(', ')}
          ),
        });
      `;

      const converted = Buffer.from(code).toString('base64');

      return `data:text/typescript;charset=utf-8;base64,${converted}`;
    },
  };

  return result as PreviewBuilder<unknown>;
}

type UnknownExternals = Record<string, unknown>;

function buildConfig(
  createDevices: DevicesFactory,
  ...externalsCreators: Array<ExternalsFactory<UnknownExternals>>
): Config<unknown> {
  const initial: ReturnType<ExternalsFactory<UnknownExternals>> = {
    createExternals: () => ({}),
    createJournalExternals: () => ({}),
  };

  return {
    retries: 0,
    devices: createDevices(),
    ...externalsCreators.reduce(
      (all, curr) => ({
        createExternals: (device) => ({
          ...all.createExternals(device),
          ...curr().createExternals(device),
        }),
        createJournalExternals: (externals, journal) => ({
          ...all.createJournalExternals(externals, journal),
          ...curr().createJournalExternals(externals, journal),
        }),
      }),
      initial,
    ),
  };
}
