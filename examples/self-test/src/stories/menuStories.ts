import { createStoriesStub } from '../arranger/createStoriesStub';
import { describe, it } from '../../storyshots/preview/config';
import { arranger } from '../arranger';
import { openGroup, selectStory } from '../reusables/actor-transformers';

export const menuStories = describe('Menu', [
  it('shows preloader skeleton when preview is loading', {}),
  it('shows select story by default for no stories', {
    arrange: arranger()
      .stories(() => [])
      .build(),
  }),
  it('show select story by default when there are stories', {
    arrange: arranger().stories(createStoriesStub).build(),
    act: (actor) =>
      actor
        .screenshot('Default')
        .do(selectStory('pets are great'))
        .screenshot('HighestLevel')
        .do(openGroup('Dogs'))
        .screenshot('DogsGroupOpened')
        .do(selectStory('loves to play with toys'))
        .screenshot('DogsStoryOpened')
        .do(openGroup('Cats'))
        .screenshot('CatsGroupOpened')
        .do(selectStory('in general are small'))
        .screenshot('CatsStoryOpened')
        .do(openGroup('Nightly'))
        .screenshot('EmptyGroupOpened')
        .do(openGroup('Daily'))
        .screenshot('InnerGroupOpened')
        .do(selectStory('during day cats love to play around')),
  }),
]);
