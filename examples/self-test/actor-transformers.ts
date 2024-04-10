import { ActorTransformer, finder } from '@storyshots/react-preview';

export const openGroup =
  (title: string): ActorTransformer =>
  (actor) =>
    actor.click(finder.getByText(title));

export const selectStory =
  (title: string): ActorTransformer =>
  (actor) =>
    actor.click(finder.getByRole('menuitem', { name: title }));

export const runStory =
  (title: string): ActorTransformer =>
  (actor) =>
    actor
      .hover(finder.getByRole('menuitem', { name: title }))
      .click(
        finder
          .getByRole('menuitem', { name: title })
          .getByRole('button', { name: 'Run' }),
      );

export const accept = (): ActorTransformer => (actor) =>
  actor.click(finder.getByRole('button').has(finder.getByText('Accept')));
