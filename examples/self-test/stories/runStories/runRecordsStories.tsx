import { ActorTransformer, finder } from '@storyshots/react-preview';
import React from 'react';
import { createStoriesStub } from '../../arranger/createStoriesStub';
import { describe, it } from '../../storyshots/preview/config';
import { arranger } from '../../arranger';
import {
  accept,
  openGroup,
  runStory,
  selectStory,
} from '../../actor-transformers';

export const runRecordsStories = describe('Records', [
  it('records marked methods calls even when empty', {
    arrange: createRecordsArranger().build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runStory('can be pet'))
        .screenshot('Ran')
        .do(openRecords())
        .screenshot('Unaccepted')
        .do(accept()),
  }),
  it('records non empty method calls', {
    arrange: createRecordsArranger().build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(selectStory('can be pet'))
        .click(finder.getByRole('button', { name: 'Pet' }))
        .do(runStory('can be pet'))
        .do(openRecords())
        .screenshot('NonEmpty')
        .do(accept()),
  }),
  it('compares records between and when they are equal', {
    arrange: createRecordsArranger()
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
        .do(runStory('can be pet'))
        .screenshot('Ran')
        .do(openRecords()),
  }),
  it('shows difference between records when there is one', {
    arrange: createRecordsArranger()
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
        .do(runStory('can be pet'))
        .screenshot('Ran')
        .do(openRecords())
        .screenshot('Diff')
        .do(accept()),
  }),
]);

function createRecordsArranger() {
  return arranger<{ pet(name: string): void }>()
    .config({
      createJournalExternals: (externals, journal) => ({
        pet: journal.record('pet', externals.pet),
      }),
      createExternals: () => ({
        pet() {},
      }),
    })
    .stories((f) =>
      createStoriesStub(f, () =>
        f.it('can be pet', {
          render: ({ pet }) => <button onClick={() => pet('Tom')}>Pet</button>,
        }),
      ),
    );
}

const openRecords = (): ActorTransformer => (actor) =>
  actor.click(finder.getByRole('menuitem', { name: 'Records' }));

// TODO: add test case for server side error and client rerun