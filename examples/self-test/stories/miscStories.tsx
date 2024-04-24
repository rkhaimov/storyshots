import { arranger } from '../arranger';
import { createStoriesStub } from '../arranger/createStoriesStub';
import {
  openGroup,
  openScreenshot,
  runStoryOrGroup,
} from '../reusables/actor-transformers';
import { describe, it } from '../storyshots/preview/config';

export const miscStories = describe('Misc', [
  it('spinner on screenshots allows clicking menu', {
    arrange: arranger()
      .stories(createStoriesStub)
      .driver((driver) => {
        let called = false;

        return {
          ...driver,
          actOnServerSide: (at, payload) => {
            if (called) {
              return new Promise(() => {});
            }

            called = true;

            return driver.actOnServerSide(at, payload);
          },
        };
      })
      .build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runStoryOrGroup('in general are small'))
        .do(openScreenshot('FINAL'))
        .do(runStoryOrGroup('in general are small')),
  }),
]);
