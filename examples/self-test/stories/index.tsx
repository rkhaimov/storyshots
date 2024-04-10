import { finder } from '@storyshots/react-preview';
import React from 'react';
import { describe, it } from '../storyshots/preview/config';
import {
  createPreviewHaving,
  createPreviewHavingStories,
} from './createPreviewHaving';
import { PresetConfigName } from '@storyshots/core';
import { PresetName } from '@storyshots/core/src';

export const stories = [
  describe('General', [
    it('shows preloader skeleton when preview is loading', {}),
    it('shows select story by default for no stories', {
      arrange: createPreviewHavingStories(() => []),
    }),
    it('show select story by default when there are stories', {
      arrange: createPreviewHavingStories((f) => [
        f.it('allows pets to be fed', {
          render: () => <h1>Feeding pets page</h1>,
        }),
      ]),
      act: (actor) =>
        actor
          .screenshot('Unselected')
          .click(finder.getByText('allows pets to be fed')),
    }),
    it('allows to group stories into groups', {
      arrange: createPreviewHavingStories((f) => [
        f.describe('Cats', [
          f.it('in general are small', {
            render: () => <h1>Image showing that cats are small</h1>,
          }),
          f.describe('Daily', [
            f.it('during day cats love to play around', {
              render: () => <h1>Cats playground</h1>,
            }),
          ]),
          f.describe('Nightly', []),
        ]),
        f.describe('Dogs', [
          f.it('loves to play with toys', {
            render: () => <h1>Dogs playground</h1>,
          }),
        ]),
      ]),
      act: (actor) =>
        actor
          .screenshot('Default')
          .click(finder.getByText('Dogs'))
          .screenshot('DogsGroupOpened')
          .click(finder.getByText('loves to play'))
          .screenshot('DogsStoryOpened')
          .click(finder.getByText('Cats'))
          .screenshot('CatsGroupOpened')
          .click(finder.getByText('in general'))
          .screenshot('CatsStoryOpened')
          .click(finder.getByText('Nightly'))
          .screenshot('EmptyGroupOpened')
          .click(finder.getByText('Daily'))
          .screenshot('InnerGroupOpened')
          .click(finder.getByText('during day')),
    }),
    it('allows to select presets when they are defined', {
      arrange: createPreviewHaving<{ theme: string; language: string }>(
        (f) => ({
          stories: [
            f.it('reacts on current theme', {
              render: (externals) => (
                <h1>
                  Current theme is {externals.theme}. Written on{' '}
                  {externals.language} language
                </h1>
              ),
            }),
          ],
          presets: [
            {
              name: 'Theme' as PresetConfigName,
              default: 'Light' as PresetName,
              additional: [
                {
                  name: 'Dark' as PresetName,
                  configure: (externals) => ({ ...externals, theme: 'Dark' }),
                },
              ],
            },
            {
              name: 'Language' as PresetConfigName,
              default: 'Russian' as PresetName,
              additional: [
                {
                  name: 'English' as PresetName,
                  configure: (externals) => ({
                    ...externals,
                    language: 'English',
                  }),
                },
                {
                  name: 'Chinese' as PresetName,
                  configure: (externals) => ({
                    ...externals,
                    language: 'Chinese',
                  }),
                },
              ],
            },
          ],
          createExternals: () => ({ theme: 'Light', language: 'Russian' }),
        }),
      ),
      act: (actor) =>
        actor
          .click(finder.getByText('reacts'))
          .screenshot('Default')
          .click(finder.getByRole('button', { name: 'right Presets' }))
          .screenshot('PresetsOpened')
          .click(finder.getByText('Dark'))
          .screenshot('DarkSelected')
          .click(finder.getByText('Light'))
          .screenshot('BackToLight')
          .click(finder.getByRole('combobox', { name: 'Language' }))
          .screenshot('OptionsShown')
          .click(finder.getBySelector('.rc-virtual-list').getByText('English'))
          .screenshot('EnglishSelected')
          .click(finder.getByRole('combobox', { name: 'Language' }))
          .click(finder.getBySelector('.rc-virtual-list').getByText('Russian')),
    }),
    it('allows to run all stories', {
      arrange: (externals) => {
        const runStories = createPreviewHavingStories((f) => [
          f.describe('Cats', [
            f.it('in general are small', {
              render: () => <h1>Image showing that cats are small</h1>,
            }),
          ]),
          f.describe('Dogs', [
            f.it('loves to play with toys', {
              render: () => <h1>Dogs playground</h1>,
            }),
          ]),
        ]);

        return runStories({
          ...externals,
          driver: {
            ...externals.driver,
            actOnServerSide: () => new Promise<never>(() => {}),
          },
        });
      },
      act: (actor) =>
        actor.click(finder.getByRole('button', { name: 'Run all' })),
    }),
    it('allows to run a single story', {
      arrange: (externals) => {
        const runStories = createPreviewHavingStories((f) => [
          f.describe('Cats', [
            f.it('in general are small', {
              render: () => <h1>Image showing that cats are small</h1>,
            }),
          ]),
          f.describe('Dogs', [
            f.it('loves to play with toys', {
              render: () => <h1>Dogs playground</h1>,
            }),
          ]),
        ]);

        return runStories({
          ...externals,
          driver: {
            ...externals.driver,
            actOnServerSide: () => new Promise<never>(() => {}),
          },
        });
      },
      act: (actor) =>
        actor
          .click(finder.getByText('Cats'))
          .click(
            finder
              .getByRole('link', { name: 'in general are small' })
              .getByRole('button', { name: 'Run' }),
          ),
    }),
    // it('allows to customize externals', {}),
  ]),
  // describe('Records', [
  //   it(
  //     'quickly captures actual behaviour only for default desktop and preset',
  //     {},
  //   ),
  //   it('completely captures records only on default device', {}),
  // ]),
  // describe('Screenshots', [
  //   it(
  //     'quickly captures actual behaviour only for default desktop and preset',
  //     {},
  //   ),
  //   it(
  //     'completely captures actual behaviour for all device modes and presets',
  //     {},
  //   ),
  // ]),
];
