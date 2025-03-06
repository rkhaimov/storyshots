import {
  Actor,
  createActor,
  JournalStoryConfig,
  StoryConfig,
} from '@storyshots/core';
import React from 'react';

export function it<TExternals>(
  title: string,
  config: StoryPayload<TExternals>,
): Story<TExternals> {
  return {
    type: 'story',
    title,
    payload: {
      render: config.render,
      act: config.act ?? (() => createActor()),
      arrange: config.arrange ?? ((externals) => externals),
      retries: config.retries ?? (() => 0),
    },
  };
}

type StoryPayload<TExternals> = {
  /**
   * Determines the number of retries for the story.
   * This function is called when the story is retried in case of failure.
   *
   * @param config - The configuration settings for the story.
   * @returns The number of retries to attempt.
   *
   * @example
   * // On mobile device, retry 3 times before marking the story as failed.
   * retries: (config) => config.device.name === 'mobile' ? 3 : 0,
   */
  retries?(config: StoryConfig): number;

  /**
   * Arranges the external dependencies for the story.
   * This function is used to prepare the necessary data or environment before the story runs.
   * Can be used to mark functions as recordable using {@link Journal}.
   *
   * @param externals - External dependencies that are available for the story.
   * @param config - The configuration settings for the story.
   * @returns The arranged external dependencies that are passed to the story.
   *
   * @example
   * // Prepare external data: a user object for rendering.
   * arrange: (externals) => ({ ...externals, getUser: async () => ({ name: 'John Doe', age: 25 }) })
   */
  arrange?(externals: TExternals, config: JournalStoryConfig): TExternals;

  /**
   * Describes actions performed in the story via an actor.
   * This function defines what the actor does during the story, such as clicking buttons or submitting forms.
   *
   * @param actor - The actor performing the actions in the story.
   * @param config - The configuration settings for the story.
   * @returns The actor with the actions performed.
   *
   * @example
   * // Simulate an action of clicking a "Save" button.
   * act: (actor) => actor.click(finder.getByText('Save'))
   */
  act?(actor: Actor, config: StoryConfig): Actor;

  /**
   * Renders the story.
   * This function is responsible for rendering the components for the story.
   *
   * @param externals - The external dependencies arranged earlier in the story.
   * @param config - The configuration settings for rendering.
   * @returns The rendered components, usually a React element.
   *
   * @example
   * // Render a UserProfile component using the arranged user data.
   * render: (externals) => <UserProfile externals={externals} />,
   */
  render(externals: TExternals, config: JournalStoryConfig): React.ReactNode;
};

export type Story<TExternals = unknown> = {
  type: 'story';
  title: string;
  payload: Required<StoryPayload<TExternals>>;
};
