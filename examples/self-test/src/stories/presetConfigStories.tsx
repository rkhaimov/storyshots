import { PresetConfigName } from '@storyshots/core';
import { finder } from '@storyshots/core';
import React from 'react';
import { arranger } from '../arranger';
import { createStoriesStub } from '../arranger/createStoriesStub';
import { fromActionsToScreenshots, Meta } from '../mocks/screenshot';
import {
  acceptActiveRecordOrScreenshot,
  openGroup,
  openRecords,
  openScreenshot,
  runCompleteStoryOrGroup,
  runStoryOrGroup,
  selectStory,
} from '../reusables/actor-transformers';
import { describe, it } from '../../storyshots/preview/config';

export const presetConfigStories = describe('PresetConfig', [
  it('allows to configure presets for preview', {
    arrange: setup().build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(selectStory('in general are small'))
        .click(finder.getByRole('button', { name: 'Toggle config pane' }))
        .screenshot('Pane')
        .click(finder.getByText('Russian'))
        .screenshot('LanguageOptions')
        .click(finder.getByText('Chinese').at(1))
        .screenshot('LanguageApplied')
        .click(finder.getByText('Dark'))
        .screenshot('DarkThemeApplied')
        .click(finder.getByRole('button', { name: 'Toggle config pane' }))
        .screenshot('PaneClosed')
        .do(runStoryOrGroup('in general are small'))
        .do(openScreenshot('FINAL'))
        .screenshot('RunResult')
        .do(acceptActiveRecordOrScreenshot()),
  }),
  it('runs screenshots for all presets permutations', {
    arrange: setup().build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runCompleteStoryOrGroup('in general are small'))
        .do(openScreenshot('FINAL'))
        .screenshot('Gallery')
        .click(finder.getByText('Theme-Light__Language-Russian'))
        .screenshot('Single')
        .do(acceptActiveRecordOrScreenshot())
        .screenshot('Accepted')
        .hover(finder.getByText('in general are small'))
        .click(finder.getByRole('button', { name: 'Accept all' })),
  }),
  it('marks story as accepted when all screenshots are valid', {
    arrange: setup()
      .driver((driver) => ({
        ...driver,
        areScreenshotsEqual: async () => true,
        getExpectedScreenshots: async (at, payload) =>
          fromActionsToScreenshots(at, payload, 'expected'),
      }))
      .build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runCompleteStoryOrGroup('in general are small'))
        .do(openScreenshot('FINAL')),
  }),
  it('marks story as unaccepted when at least one screenshot is invalid', {
    arrange: setup()
      .driver((driver) => ({
        ...driver,
        areScreenshotsEqual: async (screenshots) => {
          const { config }: Meta = JSON.parse(screenshots.right);

          return config.presets['Theme' as PresetConfigName] === 'Light';
        },
        getExpectedScreenshots: async (at, payload) =>
          fromActionsToScreenshots(at, payload, 'expected'),
      }))
      .build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runCompleteStoryOrGroup('in general are small'))
        .do(openScreenshot('FINAL')),
  }),
  it('records are not split for each preset', {
    arrange: setup().build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runCompleteStoryOrGroup('in general are small'))
        .do(openRecords()),
  }),
]);

function setup() {
  return arranger<{ lang: string; theme: string }>()
    .config((config) => ({
      ...config,
      presets: [
        {
          name: 'Language',
          default: 'Russian',
          additional: [
            {
              name: 'Chinese',
              configure: (externals) => ({ ...externals, lang: 'chinese' }),
            },
            {
              name: 'English',
              configure: (externals) => ({ ...externals, lang: 'english' }),
            },
          ],
        },
        {
          name: 'Theme',
          default: 'Light',
          additional: [
            {
              name: 'Dark',
              configure: (externals) => ({ ...externals, theme: 'dark' }),
            },
          ],
        },
      ],
      createExternals: () => ({ lang: 'russian', theme: 'light' }),
    }))
    .stories((f) =>
      createStoriesStub(f, () =>
        f.it('in general are small', {
          render: (externals) => (
            <h1>
              Current lang is {externals.lang} and theme is {externals.theme}
            </h1>
          ),
        }),
      ),
    );
}
