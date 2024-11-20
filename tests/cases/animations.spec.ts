import { test } from '../reusables/test';
import {
  acceptStoryOrGroup,
  openScreenshot,
  runStoryOrGroup,
  screenshot,
} from './actors';
import { preview } from '../reusables/preview';

test('deals with css based transitions', {
  preview: preview().stories(({ it, createElement, useState, finder }) => [
    it('pets are great', {
      act: (actor) => actor.click(finder.getByRole('button', { name: 'Run' })),
      render: () => {
        const [scale, setScale] = useState(1);

        return createElement(
          'div',
          {},
          createElement(
            'h1',
            {
              style: {
                transition: 'transform 500ms',
                transform: `scale(${scale})`,
                transformOrigin: 'left',
              },
            },
            'Hello animation',
          ),
          createElement('button', { onClick: () => setScale(2) }, 'Run'),
        );
      },
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');
    await acceptStoryOrGroup(page, 'pets are great');
    await runStoryOrGroup(page, 'pets are great');
    await openScreenshot(page, 'FINAL');
    await screenshot(page);
  },
});

test('deals with input carets', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) => actor.click(finder.getByPlaceholder('Enter your name')),
      render: () => createElement('input', { placeholder: 'Enter your name' }),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');
    await acceptStoryOrGroup(page, 'pets are great');
    await runStoryOrGroup(page, 'pets are great');
    await openScreenshot(page, 'FINAL');
    await screenshot(page);
  },
});

test('deals with css keyframes based animations', {
  preview: preview().stories(({ it, createElement }) => [
    it('pets are great', {
      render: () =>
        createElement(
          'div',
          {},
          createElement(
            'style',
            {},
            `
            @keyframes spin {
                to {
                  transform: rotate(360deg);
                  transform-origin: center;
                }
            }
          `,
          ),
          createElement(
            'h1',
            { style: { animation: 'spin 1s infinite linear' } },
            'Hello animation',
          ),
        ),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');
    await acceptStoryOrGroup(page, 'pets are great');
    await runStoryOrGroup(page, 'pets are great');
    await openScreenshot(page, 'FINAL');
    await screenshot(page);
  },
});

test('deals with js based animations', {
  preview: preview()
    .externals<{ animate(cb: () => void): () => void }>(() => ({
      createExternals: ({ screenshotting }) => ({
        animate: (cb) => {
          if (screenshotting) {
            return () => {};
          }

          const id = setInterval(cb, 1_000 / 60);

          return () => clearInterval(id);
        },
      }),
      createJournalExternals: (it) => it,
    }))
    .stories(({ it, createElement, useState, useEffect }) => [
      it('pets are great', {
        render: ({ animate }) => {
          const [rotation, setRotation] = useState(0);

          useEffect(() => animate(() => setRotation((prev) => prev + 1)), []);

          return createElement(
            'h1',
            {
              style: {
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'left',
              },
            },
            'Hello animations',
          );
        },
      }),
    ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');
    await acceptStoryOrGroup(page, 'pets are great');
    await runStoryOrGroup(page, 'pets are great');
    await openScreenshot(page, 'FINAL');
    await screenshot(page);
  },
});
