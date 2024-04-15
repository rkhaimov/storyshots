import { ActorTransformer, finder } from '@storyshots/react-preview';

export const openGroup =
  (title: string): ActorTransformer =>
  (actor) =>
    actor.click(finder.getByText(title));

export const selectStory =
  (title: string): ActorTransformer =>
  (actor) =>
    actor.click(finder.getByRole('menuitem', { name: title }));

export const runStoryOrGroup =
  (title: string): ActorTransformer =>
  (actor) =>
    actor
      .hover(finder.getByRole('menuitem', { name: title }))
      .click(
        finder
          .getByRole('menuitem', { name: title })
          .getByRole('button', { name: 'Run' }),
      );

export const acceptActiveRecordOrScreenshot = (): ActorTransformer => (actor) =>
  actor.click(finder.getByRole('button').has(finder.getByText('Accept')));

export const openScreenshot =
  (name: string, at = 0): ActorTransformer =>
  (actor) =>
    actor.click(finder.getByRole('menuitem', { name }).at(at));

export const openRecords = (at = 0): ActorTransformer => (actor) =>
  actor.click(finder.getByRole('menuitem', { name: 'Records' }).at(at));

export const runCompleteStoryOrGroup =
  (title: string): ActorTransformer =>
  (actor) =>
    actor
      .hover(finder.getByRole('menuitem', { name: title }))
      .click(
        finder
          .getByRole('menuitem', { name: title })
          .getByRole('button', { name: 'Run complete' }),
      );