import { ActionMeta, StoryID } from '@storyshots/core';
import {
  ActionsAndConfig,
  Screenshot,
  ScreenshotPath,
} from '../../../packages/manager/src/reusables/types';

export function fromActionsToScreenshots(
  at: StoryID,
  payload: ActionsAndConfig,
  mode: string,
): Screenshot[] {
  return payload.actions
    .filter(
      (it): it is Extract<ActionMeta, { action: 'screenshot' }> =>
        it.action === 'screenshot',
    )
    .map((it) => ({
      name: it.payload.name,
      path: createMeta({
        at,
        name: `${mode} ${it.payload.name}`,
        config: payload.config,
      }),
    }));
}

export function fromMetaToImage(path: string) {
  const { at, name, config }: Meta = JSON.parse(path);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.style.backgroundColor = 'gray';
  svg.setAttribute('width', '1000');
  svg.setAttribute('height', '500');

  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  title.setAttribute('font-size', '22px');
  title.setAttribute('fill', 'white');
  title.setAttribute('x', '50%');
  title.setAttribute('y', '5%');
  title.setAttribute('dominant-baseline', 'middle');
  title.setAttribute('text-anchor', 'middle');

  title.appendChild(document.createTextNode(at));

  svg.appendChild(title);

  const body = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  body.setAttribute('font-size', '22px');
  body.setAttribute('fill', 'white');
  body.setAttribute('x', '50%');
  body.setAttribute('y', '50%');
  body.setAttribute('dominant-baseline', 'middle');
  body.setAttribute('text-anchor', 'middle');

  body.appendChild(document.createTextNode(name));

  svg.appendChild(body);

  const device = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  device.setAttribute('font-size', '22px');
  device.setAttribute('fill', 'white');
  device.setAttribute('x', '50%');
  device.setAttribute('y', '80%');
  device.setAttribute('dominant-baseline', 'middle');
  device.setAttribute('text-anchor', 'middle');

  device.appendChild(
    document.createTextNode(JSON.stringify(config.device, null, 2)),
  );

  svg.appendChild(device);

  const presets = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'text',
  );

  presets.setAttribute('font-size', '22px');
  presets.setAttribute('fill', 'white');
  presets.setAttribute('x', '50%');
  presets.setAttribute('y', '75%');
  presets.setAttribute('dominant-baseline', 'middle');
  presets.setAttribute('text-anchor', 'middle');

  presets.appendChild(
    document.createTextNode(JSON.stringify(config.presets, null, 2)),
  );

  svg.appendChild(presets);

  return `data:image/svg+xml;base64,${window.btoa(
    new XMLSerializer().serializeToString(svg),
  )}`;
}

function createMeta(meta: Meta) {
  return JSON.stringify(meta) as ScreenshotPath;
}

export type Meta = {
  at: StoryID;
  config: ActionsAndConfig['config'];
  name: string;
};
