import { createGroup, createStory } from '../storyshots/client/config';
import { createNeverEndingPromise } from './utils';

export const counterStories = createGroup('Counter', [
  createStory({
    title: 'Default',
  }),
  createStory({
    title: 'Increment',
    act: (actor, finder) =>
      actor
        .click(finder.getByRole('button', { name: 'Open counter example' }))
        .click(finder.getByRole('button', { name: 'Increment' })),
  }),
  createStory({
    title: 'Decrement',
    act: (actor, finder) =>
      actor
        .click(finder.getByRole('button', { name: 'Open counter example' }))
        .click(finder.getByRole('button', { name: 'Increment' }))
        .screenshot('Incremented')
        .click(finder.getByRole('button', { name: 'Decrement' })),
  }),
  createStory({
    title: 'Initializing',
    arrange: (externals) => ({
      ...externals,
      counter: {
        ...externals.counter,
        getInitialValue: createNeverEndingPromise,
      },
    }),
    act: (actor, finder) =>
      actor.click(finder.getByRole('button', { name: 'Open counter example' })),
  }),
  createStory({
    title: 'OtherInitialValue',
    arrange: (externals) => ({
      ...externals,
      counter: {
        ...externals.counter,
        getInitialValue: async () => 10,
      },
    }),
    act: (actor, finder) =>
      actor.click(finder.getByRole('button', { name: 'Open counter example' })),
  }),
  createStory({
    title: 'PassingCorrectNow',
    arrange: (externals, journal) => ({
      ...externals,
      counter: {
        ...externals.counter,
        getInitialValue: journal.record(
          'getInitialValue',
          externals.counter.getInitialValue,
        ),
      },
    }),
    act: (actor, finder) =>
      actor.click(finder.getByRole('button', { name: 'Open counter example' })),
  }),
]);
