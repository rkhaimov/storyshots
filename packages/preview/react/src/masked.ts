import { createActor, UserScreenshotOptions } from '@storyshots/core';
import { StoryTree } from './tree/types';

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
