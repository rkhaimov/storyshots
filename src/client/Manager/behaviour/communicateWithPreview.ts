import { RefObject } from 'react';
import { StoryID } from '../../../reusables/types';
import { assertNotEmpty } from '../../../reusables/utils';
import {
  FromManagerToPreviewMessage,
  FromPreviewToManagerMessage,
  SerializableStoryshotsNode,
} from '../../reusables/channel';

export async function communicateWithPreview(
  ref: RefObject<HTMLIFrameElement>,
  id: StoryID | undefined,
  screenshotting: boolean,
): Promise<SerializableStoryshotsNode[]> {
  const preview = ref.current;

  assertNotEmpty(preview);

  await waitForPreviewToLoad(preview);

  return getPreviewStories(preview, id, screenshotting);
}

function getPreviewStories(
  preview: HTMLIFrameElement,
  id: StoryID | undefined,
  screenshotting: boolean,
): Promise<SerializableStoryshotsNode[]> {
  const channel = new MessageChannel();

  assertNotEmpty(preview.contentWindow);

  const message: FromManagerToPreviewMessage = {
    type: 'select-story',
    story: id,
    screenshotting,
  };

  preview.contentWindow.postMessage(message, '*', [channel.port2]);

  return new Promise((resolve) => {
    channel.port1.onmessage = (
      event: MessageEvent<FromPreviewToManagerMessage>,
    ) => {
      if (event.data.type === 'stories-changed') {
        channel.port1.onmessage = () => {};

        resolve(event.data.stories);
      }
    };
  });
}

function waitForPreviewToLoad(iframe: HTMLIFrameElement) {
  return new Promise<void>((resolve) => {
    const onLoad = () => {
      iframe.removeEventListener('load', onLoad);

      resolve();
    };

    iframe.addEventListener('load', onLoad);
  });
}
