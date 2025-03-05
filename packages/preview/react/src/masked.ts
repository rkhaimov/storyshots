import { createActor, UserScreenshotOptions } from '@storyshots/core';
import { StoryTree } from './tree/types';

/**
 * Applies masking options to elements globally within a StoryTree.
 *
 * This function traverses the provided StoryTree and augments each 'story' node's
 * `act` function to include the specified masking options. This ensures that
 * during the execution of each story, elements matching the provided selectors
 * are masked in screenshots, which is particularly useful for hiding sensitive
 * information like passwords or personal data.
 *
 * @param options - An object specifying masking details:
 *   - `mask`: An array of selectors identifying elements to be masked.
 *   - `maskColor`: A string representing the color to use for the mask overlays.
 * @param node - The root of the StoryTree to which the masking options will be applied.
 * @returns A new StoryTree with the masking options applied to each 'story' node.
 *
 * @example
 * ```typescript
 * // Mask the password field in all authentication-related stories
 * const stories = [
 *    masked({ mask: [finder.getByLabel('Password')] }, authStories),
 *    // ...
 * ];
 * ```
 */
export function masked(
  options: UserScreenshotOptions,
  node: StoryTree,
): StoryTree {
  switch (node.type) {
    case 'aggregate':
    case 'group':
      return {
        ...node,
        children: node.children.map((child) => masked(options, child)),
      };
    case 'story':
      return {
        ...node,
        payload: {
          ...node.payload,
          act: (actor, config) => {
            const meta = node.payload.act(actor, config).__toMeta();

            return createActor(
              meta.map((action) => {
                if (action.action !== 'screenshot') {
                  return action;
                }

                action.payload.options = {
                  mask: options.mask?.map((selector) => selector.__toMeta()),
                  maskColor: options.maskColor,
                };

                return action;
              }),
            );
          },
        },
      };
  }
}
