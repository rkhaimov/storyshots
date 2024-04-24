import { finder } from '@storyshots/core';
import React from 'react';
import {
  acceptActiveRecordOrScreenshot,
  openGroup,
  openRecords,
  runStoryOrGroup,
  selectStory,
} from '../../reusables/actor-transformers';
import { arranger } from '../../arranger';
import { createStoriesStub } from '../../arranger/createStoriesStub';
import { describe, it } from '../../storyshots/preview/config';

export const runRecordsStories = describe('Records', [
  it('records marked methods calls even when empty', {
    arrange: setup().build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runStoryOrGroup('can be pet'))
        .screenshot('Ran')
        .do(openRecords())
        .screenshot('Unaccepted')
        .do(acceptActiveRecordOrScreenshot()),
  }),
  it('records non empty method calls', {
    arrange: setup().build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(selectStory('can be pet'))
        .click(finder.getByRole('button', { name: 'Pet' }))
        .do(runStoryOrGroup('can be pet'))
        .do(openRecords())
        .screenshot('NonEmpty')
        .do(acceptActiveRecordOrScreenshot()),
  }),
  it('compares records between and when they are equal', {
    arrange: setup()
      .driver((driver) => ({
        ...driver,
        getExpectedRecords: async () => [
          {
            method: 'pet',
            args: ['Tom'],
          },
        ],
      }))
      .build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(selectStory('can be pet'))
        .click(finder.getByRole('button', { name: 'Pet' }))
        .do(runStoryOrGroup('can be pet'))
        .screenshot('Ran')
        .do(openRecords()),
  }),
  it('shows difference between records when there is one', {
    arrange: setup()
      .driver((driver) => ({
        ...driver,
        getExpectedRecords: async () => [],
      }))
      .build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(selectStory('can be pet'))
        .click(finder.getByRole('button', { name: 'Pet' }))
        .do(runStoryOrGroup('can be pet'))
        .screenshot('Ran')
        .do(openRecords())
        .screenshot('Diff')
        .do(acceptActiveRecordOrScreenshot()),
  }),
]);

function setup() {
  return arranger<{ pet(name: string): void }>()
    .config((config) => ({
      ...config,
      createJournalExternals: (externals, journal) => ({
        pet: journal.record('pet', externals.pet),
      }),
      createExternals: () => ({
        pet() {},
      }),
    }))
    .stories((f) =>
      createStoriesStub(f, () =>
        f.it('can be pet', {
          render: ({ pet }) => <button onClick={() => pet('Tom')}>Pet</button>,
        }),
      ),
    );
}

// TODO: add test case for server side error and client rerun