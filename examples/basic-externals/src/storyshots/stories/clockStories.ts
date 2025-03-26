import { finder, only } from '@storyshots/core';
import { describe, it } from '../preview/config';
import { open } from './utils/actors';

export const clockStories = only(
  ['desktop'],
  describe('Clock', [
    it('shows default time', {
      act: open('Clock'),
    }),
    it('allows to select now', {
      act: (actor) =>
        actor
          .do(open('Clock'))
          .click(finder.getByPlaceholder('Select time'))
          .screenshot('Popup')
          .click(finder.getByText('Now')),
    }),
    it('shows message after a while', {
      act: (actor) =>
        actor
          .do(open('Clock'))
          .click(finder.getByText('Show current'))
          .exec(() => window.tick(10_000)),
    }),
  ]),
);
